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
        let name = this.state.name
        let content = this.state.content
        const noteId = this.noteID()
        const date = Date.now()
        const note = {
            id: noteId,
            name: name,
            modified: date,
            folderId: folderId,
            content: content
        }
        this.setState({ error: null })

        fetch(`${config.API_ENDPOINT}/notes`, {
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
      const folderInfo = this.context.folders;
       return(
        <div>
          <form onSubmit = {this.handleSubmit}>
            <label for="folderSelection">Select a Folder</label>
            <select name="folderSelection" id="folderSelection">
              {folderInfo.map(folder =>
                <option 
                value={folder.id}              
                >{folder.name}</option>
                )}
            </select>

            <label for="name">Note name</label>
            <input 
              type='text'
              name='name'
              id='name'
              placeholder="Name of note"
              value={this.state.name}
              onChange= {(e) => this.setState({name: e.currentTarget.value})}
              required />

            <label for="content">Content</label>
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

AddNote.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}