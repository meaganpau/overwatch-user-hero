import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'jquery';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getHeroImage = this.getHeroImage.bind(this);
		this.state = {
			loading: false,
			load1: false,
			load2: false,
			message: 'Enter in Battle ID',
			battleTag: '',
			username: '',
			level: '',
			portrait: '',
			rank: '',
			rank_img: '',
			main_hero: null,
			main_hero_portrait: ''
		}
	}

	// componentDidMount() {

	// }
	handleChange(e) {
		this.setState({battleTag: e.target.value});
	}
	
	handleSubmit(e) {
		e.preventDefault();
		this.setState({loading: true});
		ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/stats/pc/us/${this.state.battleTag}`,
			success: function(data) {
				this.setState({username: data.username});
				this.setState({level: data.level});
				this.setState({portrait: data.portrait});
				this.setState({load1: false});
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
				this.setState({load1: false});
			}.bind(this)
		}).then( response => {
			if (!this.state.load1 && !this.state.load2) {
				this.setState({loading: false});
				// getHeroImage();
				// debugger;
				// this.setState({hero_img: this.state.main_hero});		
				
			}
		})
		ajax({
			// litto-1574
			// uDara-11253
			url: `http://overwatch-mp.herokuapp.com/profile/pc/us/${this.state.battleTag}`,
			success: function(data) {
				this.setState({load2: false});
				this.setState({rank: data.competitive.rank});
				this.setState({rank_img: data.competitive.rank_img});
				console.log(data);
			} .bind(this), error: function(xhr, status, err) {
				this.setState({main_hero: 'Battletag not found'});
				this.setState({loading: false});
				this.setState({load2: false});
			}.bind(this)
		}).then(response => {
			if (!this.state.load1 && !this.state.load2) {
				this.setState({loading: false});
				// getHeroImage();
				// debugger;
				// this.setState({hero_img: this.state.main_hero});		
		
			}
		})
	}

	getHeroImage(){
		debugger;
		this.setState({hero_img: this.state.main_hero});		
	}

	render() {
		return (
			<div className="abc">
				{ this.state.loading ? <Loading/> : null }
				<p>{this.state.message}</p>
				<div className="input">
					<form onSubmit={this.handleSubmit}>
					<label>Battle Tag: </label>
					{/* <input type="text" value={this.state.battleTag} /> */}
					<input type="text" value={this.state.battleTag} onChange={this.handleChange} />
					<input type="submit" value="Submit" />
					</form>
				</div>
				<h2>{this.state.username}</h2>
				<p>{this.state.level}</p>
				<p>{this.state.rank}</p>
				<p>{this.state.main_hero}</p>
				<img src={this.state.main_hero_portrait}/>
				<img src={this.state.rank_img}/>
				<img src={this.state.portrait}/>
				{/* <img className="image" src={"images/" + this.props.image} /> */}
				{ !this.state.loading && this.state.main_hero ? 
					<img src={"https://d1u1mce87gyfbn.cloudfront.net/media/screenshot/" + this.state.main_hero.toLowerCase() + "-screenshot-001.jpg"}/>
				 : null }
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