import React from 'react';
import {ajax} from 'jquery'

export default class PicAndLink extends React.Component {
    componentDidMount() {
        this.props.getAlbumArtwork(this.props.data.artist_name, this.props.index);
    }
    render() {
        return(
            <div>
                <img className="artistPic" src={this.props.artistPic} alt=""/>
                <h3>Song: {this.props.data.track_name}</h3>
                <p>Artist: {this.props.data.artist_name}</p>
                <p>Album: {this.props.data.album_name}</p>
                <a className="playSpo" href={this.props.artistLink}>Play {this.props.data.artist_name} on Spotify</a>
            </div>
        )
    }
}

