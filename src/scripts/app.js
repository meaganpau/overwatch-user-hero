import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import Loading from './components/loading.jsx';
import IntroMessage from './components/intro-msg.jsx';
import InputForm from './components/input-form.jsx';
import HeroScreen from './components/hero-screen.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			battleTag: '',
			username: '',
			level: '',
			portrait: '',
			rank: '',
			rank_img: '',
			levelFrame: '',
			stars: '',
			main_hero: null,
			loading: false,
			heroLoaded: false, 
			notFound: false,
			noInput: null,
			no_hrs: false
		}
	}

	cleanBattleTag = userInput => {
		let cleanedBattledTag;
		cleanedBattledTag = userInput.replace(/\#/g,'-');
		return cleanedBattledTag;
	}

	handleChange = (e) => {
		let battleTag = this.cleanBattleTag(e.target.value);
		this.setState({battleTag});
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		if(this.state.battleTag.length) {
			this.setState({noInput: false});
		} else {
			this.setState({noInput: true});			
			return false;
		}
		this.setState({loading: true});
		const userSearch1 = ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/stats/pc/global/${this.state.battleTag}`,
			success: function(data) {
				this.setState({username: data.username});
				this.setState({level: data.level});
				this.setState({portrait: data.portrait});
				if (data.stats.top_heroes.competitive[0].played !== '--') {
					this.setState({main_hero: data.stats.top_heroes.competitive[0].hero});
				} else if (data.stats.top_heroes.quickplay[0].played !== '--') {
					this.setState({main_hero: data.stats.top_heroes.quickplay[0].hero});
				} else {
					this.setState({no_hrs: true});
				}
			} .bind(this), error: function(xhr, status, err) {
				this.setState({notFound: true});
				this.setState({loading: false});
			} .bind(this)
		})
		const userSearch2 = ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/profile/pc/us/${this.state.battleTag}`,
			success: function(data) {
				this.setState({rank: data.competitive.rank});
				this.setState({rank_img: data.competitive.rank_img});
				this.setState({levelFrame: data.levelFrame + 'png'});
				this.setState({stars: data.star  + 'png'});
				// console.log(data);
			} .bind(this), error: function(xhr, status, err) {
				this.setState({notFound: true});
				this.setState({loading: false});
			} .bind(this)
		})
		
		let owPromises = [
			userSearch1,
			userSearch2
		];
		Promise.all(owPromises).then(values => {
			this.setState({loading: false});	
			this.setState({heroLoaded: true})		
		})
	}

	getHeroImage = () => {
		this.setState({hero_img: this.state.main_hero});		
	}

	render() {
		
		const { loading, main_hero, heroLoaded, battleTag, no_hrs, username, notFound, noInput } = this.state;
		
		let heroBG;

		if (main_hero) {
			heroBG = main_hero.replace(/\./g,'').toLowerCase();
		}

		{!loading && main_hero ? document.body.style.backgroundImage = `url(https://d1u1mce87gyfbn.cloudfront.net/media/screenshot/${heroBG}-screenshot-001.jpg)`
		 : null }
		
		let screen;
		
		if (heroLoaded) {
			screen = <HeroScreen stats={this.state} />			
		} else {
			screen = <InputForm 
			onSubmit={ this.handleSubmit } 
			battleTag={ battleTag } 
			onChange={ this.handleChange } 
			notFound={ notFound } 
			noInput={ noInput } 
			noHrs={ no_hrs }/>;
		}
		return (
			<div className="main-container">
				{ loading ? <Loading/> : null }
				<div className="screen-container">
					{ !username ? <IntroMessage /> : null }
					{ screen }
				</div>
			</div>
		)
	}
}

const mountApp = document.getElementById('app');

ReactDOM.render(<App />, mountApp);