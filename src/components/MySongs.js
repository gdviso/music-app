import React from 'react';
import PicAndLink from './Spotify';


export default function MySongs(props) {
	return  ( <li>
				<p>{props.data.name}</p>
				<p>By: {props.data.artist}</p>
				<button onClick={() => props.remove(props.data)}>❌ Remove Song</button>
			</li>)
}