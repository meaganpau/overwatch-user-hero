import React from 'react';

function HeroScreen(props) {
	const { portrait, rank_img, levelFrame, stars, username, level, rank, main_hero } = props.stats;

	let portrait_details = <div className="portrait_details">
			{ portrait ? <img id="hero-portrait" src={portrait}/> : null }
			{ levelFrame ? <img id="level-frame" src={levelFrame}/> : null }
			{ stars ? <img id="stars-img" src={stars}/> : null }
		</div>

let hero_details = <div className="user_details_container">
			<div className="user_username">
				{ rank_img ? <img id="rank-img" src={rank_img}/> : null }
				{ username ? <h2 id="username">{username}</h2> : null }
				{ rank_img ? <div id="rank-img-block"></div> : null }
			</div>
			<div className="user_details">
				{ level ? <p id="user-level">Level: {level}</p> : null }
				{ rank ? <p id="user-sr">SR: {rank}</p> : null }
				{ main_hero ? <p id="user-main">Main: {main_hero}</p> : null }
			</div>
		</div>

	return (
		<div className="hero-screen">
			{portrait_details}
			{hero_details}
		</div>
	)
}

export default HeroScreen;