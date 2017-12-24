import React from 'react';
import OwLogo from './ow-logo.jsx';


const IntroMessage = () => (
    <div className="intro-block-header">
        <OwLogo />
        <div className="intro-block-header-msg">
            <p>To get started, enter in your BattleTag below.</p>
            <p className="intro-block-help-text">ie. (FallenSlayer#3592)</p>
        </div>
    </div>
)

export default IntroMessage;