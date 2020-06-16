import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import styles from './styles'

class Note extends Component {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
            <div className={classes.toolbar} />
            <Typography paragraph>
                Hello I am note
            </Typography>
            </main>
        )
    }
}

export default (withStyles(styles)(Note));