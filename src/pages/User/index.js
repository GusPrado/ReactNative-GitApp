import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { Container,
            Header,
            Avatar,
            Name,
            Bio,
            Stars,
            Starred,
            OwnerAvatar,
            Info,
            Title,
            Author,
            Loading} from './styles';

export default class User extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func
        }).isRequired,
    }
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name
    })

    state = {
       stars: [],
       loading: true,
       page: 1,
       refresh: false
    }

    async componentDidMount() {
        this.load()
    }

    load = async (page = 1) => {
        const { navigation } = this.props
        const { stars } = this.state
        const user = navigation.getParam('user')

        const res = await api.get(`/users/${user.login}/starred`, {
            params: {page}
        });

        this.setState({
            stars: page >= 2 ? [...stars, ...res.data] : res.data,
            page,
            loading: false,
            refresh: false
        })
    };



    loadMore = () => {
        const { page } = this.state
        const nextPage = page + 1

        this.load(nextPage)
    }

    refreshList = () => {
        this.setState({ refresh: true, stars: []}, this.load)
    }

    handleNavigate = repository => {
        const { navigation } = this.props
        navigation.navigate('Repository', { repository })
    }

    render() {
        const { navigation } = this.props;
        const user = navigation.getParam('user')
        const { stars, loading, refresh } = this.state

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }}/>
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (<Loading />) : (

                <Stars
                    data={stars}
                    onRefresh={this.refreshList}
                    refreshing={refresh}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.loadMore}
                    keyExtractor={star => String(star.id)}
                    renderItem={({ item }) => (
                        <Starred onPress={() => this.handleNavigate(item)}>
                            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.login}</Author>
                            </Info>
                        </Starred>
                    )}
                />
                )}
            </Container>
        );
    }
}
