import React from 'react';
import {ajax} from 'jquery'

export default class PicAndLink extends React.Component {
    componentDidMount() {
        this.props.getAlbumArtwork(this.props.data.artist_name, this.props.index);
    }
    render() {
        return(
            <div>
                <div className="artistPicWrapper">
                    <img className="artistPic" src={this.props.artistPic} alt=""/>
                </div>
                <div className="info">
                    <p className="songTitle">{this.props.data.track_name}</p>
                    <p className="artistTitle">{this.props.data.artist_name}</p>
                </div>
                <a className="playSpo" href={this.props.artistLink} target="_blank">Play {this.props.data.artist_name} on Spotify</a>
            </div>
        )
    }
}

