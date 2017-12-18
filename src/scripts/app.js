import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';

function IntroMessage(props) {
	return (
		<p>Enter Battle Tag</p>
	)
}

function InputForm(props) {
	return (
		<div className="input">
			<form onSubmit={props.onSubmit}>
			<label>Battle Tag: </label>
			<input type="text" onChange={props.onChange} />
			<input type="submit" value="Submit" onClick={props.onSubmit}/>
			</form>
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			// load1: false,
			// load2: false,
			battleTag: '',
			username: '',
			level: '',
			portrait: '',
			rank: 'N/A',
			rank_img: '',
			main_hero: null,
			main_hero_portrait: ''
		}
	}

	handleChange = (e) => {
		this.setState({battleTag: e.target.value});
	}
	
	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({battleTag: e.target.value});
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
					this.setState({main_hero_portrait: data.stats.top_heroes.competitive[0].img});
				} else if (data.stats.top_heroes.quickplay[0].played !== '--') {
					this.setState({main_hero: data.stats.top_heroes.quickplay[0].hero});
					this.setState({main_hero_portrait: data.stats.top_heroes.quickplay[0].img});
				} else {
					this.setState({main_hero: 'Start playing Overwatch!'});
				}
			} .bind(this), error: function(xhr, status, err) {
				this.setState({main_hero: 'Battletag not found'});
				this.setState({loading: false});
			}
		})
		const userSearch2 = ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/profile/pc/us/${this.state.battleTag}`,
			success: function(data) {
				this.setState({rank: data.competitive.rank});
				this.setState({rank_img: data.competitive.rank_img});
				console.log(data);
			} .bind(this), error: function(xhr, status, err) {
				this.setState({main_hero: 'Battletag not found'});
				this.setState({loading: false});
			}
		})
		Promise.all([userSearch1, userSearch2]).then(values => {
			this.setState({loading: false});			
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
				{ this.state.loading ? <Loading/> : null }
				{ !this.state.username ? <IntroMessage /> : null }
				<InputForm 
					onSubmit={ this.handleSubmit } 
					battleTag={ this.battleTag } 
					onChange={ this.handleChange }
				/>
				{ this.state.main_hero_portrait ? <img src={this.state.main_hero_portrait}/> : null }
				{ this.state.portrait ? <img src={this.state.portrait}/> : null }
				{ this.state.rank_img ? <img src={this.state.rank_img}/> : null }
				<h2>{this.state.username}</h2>
				<p>Level: {this.state.level}</p>
				<p>SR: {this.state.rank}</p>
				<p>Main: {this.state.main_hero}</p>
			</div>
		)
	}
}

const Loading = () => (
	<div className='loading'>
		<i className="fa fa-spinner fa-spin" />
	</div>
)

const mountApp = document.getElementById('app');

ReactDOM.render(<App />, mountApp);