import React from 'react';
import PicAndLink from './Spotify';


export default function MySongs(props) {
	return  ( <div>
				<img className="listPic" src={props.data.pic} alt=""/>
				<a className="playSpo" href={props.data.link}>Play {props.data.artist} on spotify</a>
				<p>{props.data.name}</p>
				<p>By: {props.data.artist}</p>
				<button onClick={() => props.remove(props.data)}>❌ Remove Song</button>
			</div>)
}