import React, { Component } from 'react';
import axios from 'axios';

import Account from '../../components/Account';
import Note from '../../components/Note';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import image from '../../assets/icon.png'

import { authMiddleWare } from '../../utils/auth';

import styles from './styles';

class Home extends Component {
	state = {
		render: false
	};

	loadAccountPage = (event) => {
		this.setState({ render: true });
	};

	loadNotePage = (event) => {
		this.setState({ render: false });
	};

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false
		};
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);
				this.setState({
					firstName: response.data.userCredentials.firstName,
					lastName: response.data.userCredentials.lastName,
					email: response.data.userCredentials.email,
					phoneNumber: response.data.userCredentials.phoneNumber,
					country: response.data.userCredentials.country,
					username: response.data.userCredentials.username,
					userId: response.data.userCredentials.userId,
					uiLoading: false,
					profilePicture: response.data.userCredentials.imageUrl
				});
			})
			.catch((error) => {
				if(error.response.status === 401) {
					this.props.history.push('/login')
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	render() {
		const { classes } = this.props;		
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
		} else {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Avatar className={classes.icon} variant='square' src={image} />
							<Typography variant="h6" noWrap>
								NoteApp
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={this.state.profilePicture} className={classes.avatar} />
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItem button key="Note" onClick={this.loadNotePage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Note" />
							</ListItem>

							<ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>

					<div>{this.state.render ? <Account /> : <Note />}</div>
				</div>
			);
		}
	}
}

export default withStyles(styles)(Home);