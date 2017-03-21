import React from 'react'
import ReactDOM from 'react-dom'
import {ajax} from 'jquery'
import Header from './components/Header';
import MySongs from './components/MySongs';
import PicAndLink from './components/Spotify';

const apiKey= '1afc4c66fe29e1273087a038b2d9574c';
const apiUrl = 'http://api.musixmatch.com/ws/1.1/track.search';

var config = {
    apiKey: "AIzaSyBCMKFO7Me4-cv3E__rvoViopWRKHYoeFg",
    authDomain: "music-app-b3597.firebaseapp.com",
    databaseURL: "https://music-app-b3597.firebaseio.com",
    storageBucket: "music-app-b3597.appspot.com",
    messagingSenderId: "820719577362"
  };
  firebase.initializeApp(config);

class App extends React.Component{
	constructor() {
        super();
        this.state = {
            song: '',
            songs: [],
            mySongs: [],
            loggedin: false
        }
        this.findSong = this.findSong.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.addSong = this.addSong.bind(this);
    }
    componentDidMount() {
		//fire base auth:
		firebase.auth().onAuthStateChanged((user) => {
			if(user){
		const dbRef = firebase.database().ref(`users/${user.uid}/songs`);
				dbRef.on('value', (data) => {
					const dataBaseData = data.val();
					const songArray = [];
					for(let songKey in dataBaseData){
						 const itemKey = dataBaseData[songKey];
						 itemKey.key = songKey;
						 songArray.push(itemKey);
					}
					this.setState({
						mySongs: songArray,
						loggedin:true
					});
				});	
			}
			else{
				this.setState({
					mySongs: [],
					loggedin:true
				});
			}
		});
	}
    findSong(e){
   		e.preventDefault();
		if(this.state.song !== " " ){ //avoid blank search
			let song = this.state.song;
			ajax({
				url: 'http://proxy.hackeryou.com',
		        dataType: 'json',
		        method:'GET',
				data:{
					reqUrl:apiUrl,
					params: {
						apikey:apiKey,
						format: 'json',
						q_lyrics: song,
						s_track_rating: 'desc',
						page_size: 3
					}
				}	
			}).then((data) => {
				console.log(data);
				this.setState({
					songs: data.message.body.track_list
				})
			});
		}
    }
    handleChange(e){
		this.setState({
			song: e.target.value

		});
	}
	addSong(songToAdd){
		const songItem ={
			name: songToAdd.track_name,
			artist: songToAdd.artist_name
		}
		const mySongs = Array.from(this.state.mySongs);
		mySongs.push(songItem);
		this.setState({
			mySongs: mySongs
		});
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/songs`);
		dbRef.push(songItem);
	}
	removeSong(removedSong){
		 const userId = firebase.auth().currentUser.uid;
		 const dbRef = firebase.database().ref(`users/${userId}/songs/${removedSong.key}`);
		 dbRef.remove();
	}
	displayResults() {
		return this.state.songs.map((song) => {
			song = song.track
			return (
				<div>
					<div className="songContainer">
						<PicAndLink data={song}/>
						<h1>Song: {song.track_name}</h1>
						<h2>Artist: {song.artist_name}</h2>
						<h3>Album: {song.album_name}</h3>
						<a href={song.track_share_url}>See full lyrics</a>
						<button onClick={() => this.addSong(song)} className="add">➕ Add to my songs!</button>
					</div>
					
				</div>
			)
		});
	}
	render(){
		return(
			<div>
				<Header/>
				<h1>Find a Song 🎵</h1>
				<form onSubmit={this.findSong}>
		             <input required type="text" onChange={this.handleChange} name="lyrics"/>
		             <input type="submit" value="Find me the song!"/>
	             </form>
	             {this.displayResults()}   

				<div className="savedSongs">
					<h2>My Music</h2>
					<ul>
						{this.state.mySongs.map((song, i) => {
							return <MySongs data={song} remove={this.removeSong} key={`song-${i}`}/>
						})}
					</ul>
				</div>
			</div>
		)
	}
}
ReactDOM.render(<App/>, document.getElementById('app'))
