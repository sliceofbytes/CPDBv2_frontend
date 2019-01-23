import React, { PropTypes } from 'react';

import style from './download-menu.sass';
import DownloadMenuItem from './download-menu-item';


export default class DownloadMenu extends React.Component {
  render() {
    const {
      officerId, zipFileUrl, zipFileUrlWithDocs,
      fetchOfficerZipFileUrl, fetchOfficerZipWithDocsFileUrl
    } = this.props;

    return (
      <div className={ style.downloadMenu }>
        <DownloadMenuItem
          text='Data + docs'
          fetchOfficerZipFileUrl={ fetchOfficerZipWithDocsFileUrl }
          officerId={ officerId }
          zipFileUrl={ zipFileUrlWithDocs }
        />

        <DownloadMenuItem
          text='Data only'
          fetchOfficerZipFileUrl={ fetchOfficerZipFileUrl }
          officerId={ officerId }
          zipFileUrl={ zipFileUrl }
        />
      </div>
    );
  }
}

DownloadMenu.propTypes = {
  hovering: PropTypes.bool,
  open: PropTypes.bool,
  closeShareMenu: PropTypes.func,
  officerId: PropTypes.number,
  zipFileUrl: PropTypes.string,
  zipFileUrlWithDocs: PropTypes.string,
  fetchOfficerZipFileUrl: PropTypes.func,
  fetchOfficerZipWithDocsFileUrl: PropTypes.func,
};
