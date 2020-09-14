import React from 'react'
import ApiContext from '../ApiContext'
import './AddNote.css'
import config from '../config'
import PropTypes from 'prop-types'

export default class AddNote extends React.Component {
    state = {
        name: '',
        content: '',
        folderId: '',
    }

    static defaultProps ={
        onAddNote: () => this.props.history.push('/')
      }

      noteID() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10); 
      }

      static contextType = ApiContext;

      handleAddNote = noteId => {
        this.props.history.push('/')
      }

      handleSubmit = e => {
        e.preventDefault()
        const folderId = document.getElementById("folderSelection").value;
        let title = this.state.name
        let content = this.state.content
        const noteId = this.noteID()
        const date = Date.now()
        const note = {
            id: noteId,
            title: title,
            modified: date,
            folder_id: folderId,
            note_contents: content
        }
        this.setState({ error: null })

        fetch(`${config.API_ENDPOINT}/api/notes`, {
          method: 'POST',
          body: JSON.stringify(note),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then(res => {
            if (!res.ok)
              return res.json().then(e => Promise.reject(e))
            return res.json()
          })
          .then(data => {

            this.context.addNote(data)
            this.props.history.push('/')
          })
          .catch(error => {
            this.setState({ error })
          })
      }


    render() {
      const {folders} = this.context;
       return(
        <div>
          <form onSubmit = {this.handleSubmit}>
            <label htmlFor="folderSelection">Select a Folder</label>
            <select name="folderSelection" id="folderSelection">
              {folders.map((folder, id) =>
                <option 
                key={id}
                value={folder.id}
                >{folder.title}</option>
                )}
            </select>

            <label htmlFor="name">Note name</label>
            <input 
              type='text'
              name='name'
              id='name'
              placeholder="Name of note"
              value={this.state.name}
              onChange= {(e) => this.setState({name: e.currentTarget.value})}
              required />

            <label htmlFor="content">Content</label>
            <textarea 
              type='text'
              name='content'
              id='content'
              placeholder='Note content'
              value={this.state.content}
              onChange= {(e) => this.setState({content: e.currentTarget.value})}
              required />
            <br></br>
            <button>Submit</button>
        </form> 
        </div>
        
       ) 
    }
}
AddNote:PropTypes.exact({
  name: PropTypes.string.isRequired,
  content:PropTypes.string.isRequired,
})