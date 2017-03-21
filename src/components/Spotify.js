import React from 'react';
import {ajax} from 'jquery'

export default class PicAndLink extends React.Component {
    constructor() {
        super();
        this.state = {
            pic: '',
            link: ''
        }
    }   
    componentDidMount() {
        ajax({
        url: 'https://api.spotify.com/v1/search',
        method: 'GET',
        dataType: 'json',
            data: {
            	q: this.props.data.artist_name,
            	type: 'artist'
            }
        })
        .then((spoData) => {
            console.log(spoData);
            if(spoData.artists.items.length > 0) {
                const spoArtist = spoData.artists.items[0];
                const artistPic = spoArtist.images[0].url;
                const artistLink = spoArtist.external_urls.spotify;
                console.log(artistPic);
                console.log(artistLink)
                this.setState({
                    pic: artistPic,
                    link: artistLink
                })
                
            }
        });
    }
    render() {
        return(
            <div>
                <img src={this.state.pic} alt=""/>
                <a href={this.state.link}>Find artist on Spotify</a>
            </div>
        )
    }
}

//this.props.data.artist

