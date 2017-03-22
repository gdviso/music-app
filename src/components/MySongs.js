import React from 'react';
import PicAndLink from './Spotify';


export default function MySongs(props) {
	return  ( <div className="savedContainer">
				<div className="savedPic">
					<img className="listPic" src={props.data.pic} alt=""/>
				</div>
				<div className="savedInfo">
					<button className="removeBtn" onClick={() => props.remove(props.data)}><i className="fa fa-times-circle" aria-hidden="true"></i></button>
					<p className="savedSong">{props.data.name}</p>
					<p className="savedArtist">{props.data.artist}</p>
					<a className="savedSpo" href={props.data.link}>Play {props.data.artist} on Spotify</a>
				</div>
			</div>)
}