import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { openUploadWidget } from '../utils/CloudinaryService';
import { photosUploaded, albumSelected } from '../actions';
import Photo from './Photo';
import { Image, Transformation } from 'cloudinary-react';
import albumList from '../config/albums';

class PhotoList extends Component {
    constructor () {
        super();
        this.state = {
            selectedAlbum: null
        }
    }

    handleAlbumSelect = event => {
        const elem = event.target;
        // clicked element either has to be div or Image
        const album = elem.id || elem.parentNode.id;
        const albumName = album.id;
        console.log('Album selected: ', albumName);
        this.setState({
            selectedAlbum: albumName
        });
        this.props.onAlbumSelect(albumName);
    }

    render() {
        return (
            <div className="photoList">

                {/* <div className="actions">
                    <NavLink className="upload_link" exact to="/photos/new">
                        Add photo with React File upload
                    </NavLink>
                </div> */}

                <div className="album-list">
                    <h2>Select Album</h2>
                    {albumList.albums.map(album => {
                        return (
                            <div key={album.tag} id={album.tag} className="album-btn" onClick={this.handleAlbumSelect}>
                                <Image  
                                    publicId={`art/${album.thumbnail}`}
                                    className="thumbnail inline"
                                    width="150"
                                    height="150"
                                    crop="fit"
                                    quality="80"
                                >
                                    <Transformation quality="auto" fetchFormat="auto" />
                                </Image>
                            </div>
                        );
                    })}
                </div>
                {this.state.selectedAlbum ? (
                    <h1>Selected Album: 
                        <span className="album-name">{this.state.selectedAlbum}</span>
                    </h1>
                ) : (
                    <h2>Please select an album</h2>
                )}
                
                
                <div className="photos">
                    {this.props.photos.length === 0 && (
                        <p>No photos were added yet.</p>
                    )}
                    {this.props.photos.map(photo => {
                        return (
                            <Photo
                                key={photo.public_id}
                                publicId={photo.public_id}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    uploadImageWithCloudinary() {
        const uploadOptions = { ...this.context };
        openUploadWidget(uploadOptions, (error, photos) => {
            if (!error) {
                this.props.onPhotosUploaded(photos);
            } else {
                console.log(error);
            }
        });
    }
}

PhotoList.propTypes = {
    photos: PropTypes.array,
    onPhotosUploaded: PropTypes.func,
    onAlbumSelect: PropTypes.func,
};

PhotoList.contextTypes = {
    cloudName: PropTypes.string,
    uploadPreset: PropTypes.string,
};

const PhotoListContainer = connect(
    state => ({ photos: state.photos }),
    {
        onPhotosUploaded: photosUploaded,
        onAlbumSelect: albumSelected
    }
)(PhotoList);

Object.assign(PhotoListContainer.contextTypes, PhotoList.contextTypes);

export default PhotoListContainer;
