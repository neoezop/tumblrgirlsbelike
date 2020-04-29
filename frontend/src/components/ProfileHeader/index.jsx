    import React, { Component } from 'react';
    import './styles.css'
    
    class ProfileHeader extends Component {
        render() {
            return (
                <div className="header"> 
                    <h1>{this.props.username}</h1>
                </div>
            );
        }
    }
    
    export default ProfileHeader;