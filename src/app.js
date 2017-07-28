import React from 'react'
import ReactDOM from 'react-dom'
import {ajax} from 'jquery'
import MySongs from './components/MySongs';
import PicAndLink from './components/Spotify';
import Header from './components/Header';


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
            loggedin: false,

        }
        this.findSong = this.findSong.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.addSong = this.addSong.bind(this);
        this.getAlbumArtwork = this.getAlbumArtwork.bind(this);
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
					loggedin:false
				});

			}
		});
	}
    findSong(e){
   		e.preventDefault();
	  
		if(this.state.song !== " " ){ //avoid blank search
			let song = this.state.song;
			ajax({
				url: 'https://proxy.hackeryou.com',
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
				// console.log(data);
				this.setState({
					songs: data.message.body.track_list
				})
			});
		}else if(this.state.song === "" ){
			alert('no bueno')
		}
    }
    handleChange(e){
		this.setState({
			song: e.target.value

		});
	}
	getAlbumArtwork(artistName, i) {
		ajax({
		url: 'https://api.spotify.com/v1/search',
		method: 'GET',
		dataType: 'json',
		    data: {
		    	q: artistName,
		    	type: 'artist'
		    }
		})
		.then((spoData) => {
			if(spoData.artists.items.length === 0) {
				const artistPic = "/public/assets/noimage.svg";
				const artistLink = "https://spotify.com/";
				const newSongs = [...this.state.songs];
				newSongs[i].pic = artistPic;
				newSongs[i].link = artistLink;
				this.setState({
					songs: newSongs
				});
			} else {
				const spoArtist = spoData.artists.items[0];
				const artistPic = spoArtist.images[0].url;
				const artistLink = spoArtist.external_urls.spotify;
				const newSongs = [...this.state.songs];
				newSongs[i].pic = artistPic;
				newSongs[i].link = artistLink;
				this.setState({
				    songs: newSongs
				})
			}
		});
	}
	addSong(songToAdd, pictureAndLink){
		const songItem ={
			name: songToAdd.track_name,
			artist: songToAdd.artist_name,
			link: pictureAndLink.link,
			pic: pictureAndLink.pic
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
		return this.state.songs.map((song,i) => {
			let ogSong = song;
			song = song.track
			// console.log(song);
			return (
				<div key={song.track_id}>
						<div className="songContainer animated zoomIn">
							<PicAndLink index={i} getAlbumArtwork={this.getAlbumArtwork} artistPic={ogSong.pic} artistLink={ogSong.link} data={song}/>
							<div className="buttons">
								<a className="lyricsBtn" href={song.track_share_url}>See full lyrics</a>
								<a onClick={() => this.addSong(song, ogSong)} className="addBtn">My Music</a>
							</div>
						</div>
					</div>
			)
		});
	}
	render(){
		// console.log(this.state.loggedin)
		let logTitle = "";
		let notice = "";

		 if (this.state.loggedin === true){
			logTitle = (
				<h2 className="myMusicTitle">My Music</h2>
			)
		}
		if(this.state.loggedin === false){
			notice=(
			<p className="notice">Create an account or login to be able to save songs!</p>
			)
		}
		{console.log(logTitle)}
		return(
			<div className="main">
				<Header/>
				{notice}
				<form onSubmit={this.findSong} className="searchForm">
		             <input required className="lyrics" type="text" onChange={this.handleChange} name="lyrics" placeholder="Type lyrics here."/>
		             <input className="findBtn" type="submit" value="Find me the song!"/>
	             </form>
	             <div className="results">
	            	 {this.displayResults()}  
	             </div> 
				<div className="savedSongs">
						{logTitle}
						{this.state.mySongs.map((song, i) => {
							return <MySongs data={song} remove={this.removeSong} key={`song-${i}`}/>
						})}
				</div>
				<footer>
				<p>Done by <a href="https://gusdom.com/">Gustavo Dominguez</a> using <a href="https://www.musixmatch.com/">Musixmatch's</a> & <a href="https://www.spotify.com">Spotify's</a> API</p></footer>
			</div>
		)
	}
}
ReactDOM.render(<App/>, document.getElementById('app'))
