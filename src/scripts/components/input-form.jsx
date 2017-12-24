import React from 'react';
import ErrorNotFound from './error-not-found.jsx';
import NoHrs from './no-hrs-msg.jsx';
import ErrorNoInput from './error-no-input.jsx';

function InputForm(props) {
	let notFound = props.notFound;
	let no_hrs = props.noHrs;
	let noInput = props.noInput;

	return (
		<div className="input-form">
			<form onSubmit={props.onSubmit}>
				<div className="input-form-row">
					<label htmlFor="battle-tag">BattleTag: </label>
					<input type="text" onChange={props.onChange} id="battle-tag" required />
					<div className="form-block"></div>
					<p className="help-text">BattleTags are case sensitive.</p>
				</div>
				{ noInput ? <ErrorNoInput /> : null }
				{ notFound ? <ErrorNotFound /> : null }
				{ no_hrs ? <NoHrs /> : null }
				<input type="submit" value="Submit" onClick={props.onSubmit}/>
			</form>
		</div>
	);
}

export default InputForm;