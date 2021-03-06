import React from 'react';
import axios from "axios"
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

export default class CreateStory extends React.Component {
  /*
    can add more inputs in future, for now just threw in a couple for testing purposes!

    I am using axios because it is so much nicer than fetch


    actually, ccould keep this as own file but render it within the home page if we need to make a new story
    (I LIKE THAT IDEA A LOT but im too lazy to do it rn pepega)
  */
 createStory(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('.storyInput');
    axios.post('/addstory', {storyname: inputs[0].value, storylength: inputs[1].value, storyfirstword: inputs[2].value})
    .then(response=> {
        console.log("This is the response: ", response.data);
        // this allows you to instantly get the (cached) documents data
        const indexeddbProvider = new IndexeddbPersistence(response.data._id, ydoc)
        indexeddbProvider.whenSynced.then(() => {
        console.log('loaded data from indexed db')
        })

        // Sync clients with the y-webrtc provider.
        const webrtcProvider = new WebrtcProvider(response.data._id, ydoc)

        // Sync clients with the y-websocket provider
        const websocketProvider = new WebsocketProvider(
        'wss://demos.yjs.dev', response.data._id, ydoc
        )
        const yarray = ydoc.getArray(response.data._id);
        yarray.insert(0, [response.data.listofwords[0]]);
        alert("Story created successfully!");
    })
 }
  render() {
    return (
      <div className="App">
        <h1>Create Story</h1>
        <br/>
        <form>
            <label for="storyname">Story name</label><input id="storyname" name="storyname" className="storyInput"></input>
            <label for="storylength">Story length</label><input id="storylength" name="storylength" className="storyInput"></input>
            <label for="storyfirstword">Story first word</label><input id="storyfirstword" name="storyfirstword" className="storyInput"></input>
            <input type="submit" value="Create Story" id="createStory" onClick={this.createStory}/>
            
        </form>
        <a href="/">Return to homepage</a>
      </div>
    );
  }
}
