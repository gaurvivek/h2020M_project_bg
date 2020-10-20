import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Downloader from "js-file-downloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
 
class CustomNotification extends React.Component {
  createNotification = (type) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('Success message', 'Title here');
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  };
 
  render() {
    return (
        <GridContainer>
                <button className='btn btn-info'
                onClick={this.createNotification('info')}>Info
                </button>
                <hr/>
                <button className='btn btn-success'
                onClick={this.createNotification('success')}>Success
                </button>
                <hr/>
                <button className='btn btn-warning'
                onClick={this.createNotification('warning')}>Warning
                </button>
                <hr/>
                <button className='btn btn-danger'
                onClick={this.createNotification('error')}>Error
                </button>
        
                <NotificationContainer/>
        </GridContainer>
    );
  }
}
 
export default CustomNotification;