import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';
import NoteContext from '../context/context';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        
    };

    componentDidMount() {
        const url = 'http://localhost:9090/'
        fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error (response.statusText);
            }
            return response.json();
            //some error
        })
        .then(
            //set state
        )
        .catch(error => )
        // fake date loading from API call
        // setTimeout(() => this.setState(dummyStore), 600);
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        
        return (
            <NoteContext.Provider value = {{
                notes,
                folders
            }}>
            <>
                {['/', '/folder/:folderId'].map(path => (
                   
                    <Route
                        exact
                        key={path}
                        path={path}

                        component={NoteListNav}
                     
                    />
                   
                ))}
               
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
               
            </>
            </NoteContext.Provider> 
            
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <NoteContext.Provider value = {{
                notes,
                folders,
                getNotesForFolder,
                findNote
         }}>
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                       
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                    
                />
            </>
            </NoteContext.Provider> 
        );
    }

    render() {
        return (
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;
