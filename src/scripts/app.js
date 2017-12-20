import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';
import OwLogo from './components/ow-logo.jsx';
import Loading from './components/loading.jsx';

function IntroMessage(props) {
	return (
		<p>Enter Battle Tag</p>
	)
}

const ErrorMessage = () => (
	<p>Error: Battle Tag not found. Please try again.</p>
)

const NoHrs = () => (
	<p>Start playing Overwatch!</p>
)

function InputForm(props) {
	let error = props.error;
	let no_hrs = props.noHrs;
	
	return (
		<div className="input">
			<form onSubmit={props.onSubmit}>
			<label>Battle Tag: </label>
			<input type="text" onChange={props.onChange} />
			<input type="submit" value="Submit" onClick={props.onSubmit}/>
			{ error ? <ErrorMessage /> : null }
			{ no_hrs ? <NoHrs /> : null }
			</form>
		</div>
	);
}

function HeroScreen(props) {
	return (
		<div className="hero-screen">
			{/* { props.stats.main_hero_portrait ? <img src={props.stats.main_hero_portrait}/> : null } */}
			{ props.stats.portrait ? <img src={props.stats.portrait}/> : null }
			{ props.stats.rank_img ? <img src={props.stats.rank_img}/> : null }
			{ props.stats.levelFrame ? <img src={props.stats.levelFrame}/> : null }
			{ props.stats.stars ? <img src={props.stats.stars}/> : null }
			{ props.stats.username ? <h2>{props.stats.username}</h2> : null }
			{ props.stats.level ? <p>Level: {props.stats.level}</p> : null }
			{ props.stats.rank ? <p>SR: {props.stats.rank}</p> : null }
			{ props.stats.main_hero ? <p>Main: {props.stats.main_hero}</p> : null }
		</div>
	)
}

function ShowScreen(props) {
	// console.log(props);
	let heroInfo = props.heroInfo;
	let isHeroLoaded = heroInfo.heroLoaded;

	if (isHeroLoaded) {
		return <HeroScreen stats={heroInfo} />			
	}

	return <InputForm onSubmit={ props.handleSubmit } battleTag={ props.battleTag } onChange={ props.handleChange } error={ heroInfo.error } noHrs={ heroInfo.no_hrs }/>;
}

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
			// main_hero_portrait: '',
			loading: false,
			heroLoaded: false, 
			error: null,
			error_message: null,
			no_hrs: false
		}
	}

	handleChange = (e) => {
		this.setState({battleTag: e.target.value});
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({loading: true});
		const userSearch1 = ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/stats/pc/us/${this.state.battleTag}`,
			success: function(data) {
				this.setState({username: data.username});
				this.setState({level: data.level});
				this.setState({portrait: data.portrait});
				if (data.stats.top_heroes.competitive[0].played !== '--') {
					this.setState({main_hero: data.stats.top_heroes.competitive[0].hero});
					// this.setState({main_hero_portrait: data.stats.top_heroes.competitive[0].img});
				} else if (data.stats.top_heroes.quickplay[0].played !== '--') {
					this.setState({main_hero: data.stats.top_heroes.quickplay[0].hero});
					// this.setState({main_hero_portrait: data.stats.top_heroes.quickplay[0].img});
				} else {
					this.setState({no_hrs: true});
				}
			} .bind(this), error: function(xhr, status, err) {
				this.setState({error: true});
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
				this.setState({error: true});
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
		{ !this.state.loading && this.state.main_hero ? 
			document.body.style.backgroundImage = `url(https://d1u1mce87gyfbn.cloudfront.net/media/screenshot/${this.state.main_hero.toLowerCase()}-screenshot-001.jpg)`
		 : null }
		return (
			<div className="main-container">
				{ !this.state.username ? <OwLogo /> : null }
				{ this.state.loading ? <Loading/> : null }
				{ !this.state.username ? <IntroMessage /> : null }
				<ShowScreen 
					heroInfo={this.state} 
					handleSubmit={this.handleSubmit} 
					handleChange={this.handleChange}
				/>
			</div>
		)
	}
}

const mountApp = document.getElementById('app');

ReactDOM.render(<App />, mountApp);