import React, { Component } from 'react';
import './styles.css'
import image1 from '../../images/sample_images/1.jpg'
import image2 from '../../images/sample_images/2.jpg'
import image3 from '../../images/sample_images/3.jpg'
import Post from '../Post'

class ImageFeed extends Component {

    render() {
        return (
            <div className="feed">
            <Post image={image1} description="%description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1description1%"/>
            <Post image={image2} description="%description2%"/>
            <Post image={image3} description="%description3%"/>
            </div>
        );
    }
}


export default ImageFeed;