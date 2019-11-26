import React from 'react'
import PropTypes from 'prop-types'

import { Browser } from './styles'

export default function Repository({ navigation }) {
    const repo = navigation.getParam('repository')

    return <Browser source={{ uri: repo.html_url }} />
}

Repository.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func
    }).isRequired
}

Repository.navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name
})
