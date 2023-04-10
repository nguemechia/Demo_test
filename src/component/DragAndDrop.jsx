import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

import '../style/darg-and-drop.css';
import { formatFileSize } from '../helper/funcHelper';
import Icon from "@material-ui/core/Icon";
import A11yButton from "./A11yButton";

/**
 * This is control component. So you must properly set and use files and setFiles
 * @param onFilesChanged
 * @param types e.g ['image/*', video.mp4', '.xlx']
 * @param maxFiles
 */
const DragAndDrop = ({ types, maxFiles, text, files, setFiles }) => {
  const _text = text;

  const options = {
    accept: types.join(', '),
    /**
     * Get executed when a uploading/dropping occurred
     * @param acceptedFiles
     */
    onDrop: (acceptedFiles) => {
      let _files = [
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
        ...files,
      ];

      if (maxFiles && _files.length > maxFiles) {
        _files = _files.slice(0, maxFiles);
      }

      setFiles(_files);
    },
    /**
     * Display error message when errors occur while uploading/dropping
     * @param rejectedFiles FileRejection[]
     */
    // onDropRejected: (rejectedFiles) => {
    //   let foundError = false;
    //   for (let i = 0; i < rejectedFiles.length; i++) {
    //     const file = rejectedFiles[i];
    //     if (file.errors.length > 0) {
    //       foundError = true;
    //       file.errors.forEach((error) => {
    //         switch (error.code) {
    //           case 'file-invalid-type':
    //             NotificationManager.error(t('file.errors.fileInvalidType'));
    //             break;
    //           case 'file-too-large':
    //             NotificationManager.error(t('file.errors.fileTooLarge'));
    //             break;
    //           case 'file-too-small':
    //             NotificationManager.error(t('file.errors.fileTooSmall'));
    //             break;
    //           case 'too-many-files':
    //             NotificationManager.error(t('file.errors.tooManyFiles', { count: maxFiles }));
    //             break;
    //           default:
    //             NotificationManager.error(t('file.errors.others'));
    //             break;
    //         }
    //       });
    //     }
    //
    //     if (foundError) break;
    //   }
    // },
  };

  if (maxFiles) {
    options.maxFiles = maxFiles;
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } =
    useDropzone(options);

  const onRemoveThumb = (file) => {
    setFiles(
      files.filter(
        (_file) => `${_file.name + _file.lastModified}` !== `${file.name + file.lastModified}`
      )
    );
  };

  const thumbs = files.map((file, index) => {
    let render = null;
    const floating = (
        // <button onClick="onRemoveThumb(file)">Fermer</button>
      <A11yButton
        elementType="div"
        onClick={() => onRemoveThumb(file)}
        className=""
      >
        <Icon color="action" > <span className='collorss'>Fermer</span></Icon>
      </A11yButton>
    );

    if (file.type.includes('video')) {
      render = (
        <div className="thumb-item">
          <div className="thumb-wrap">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video id="video" width="400" controls className="thumb-elt">
              <source src={file.preview} />
            </video>
          </div>
          {floating}
        </div>
      );
    } else if (file.type.includes('image')) {
      render = (
        <div className="thumb-item">
          <div className="thumb-wrap">
            <img alt="preview" src={file.preview} className="thumb-elt" />
          </div>
          {floating}
        </div>
      );
    } else {
      render = (
        <div className="thumb-item raw-file">
          <div className="thumb-wrap">
            <div>
              <p>{formatFileSize(file.size).formattedSize}</p>
              <p>{file.name}</p>
            </div>
          </div>
          {floating}
        </div>
      );
    }

    return <div key={index}>{render}</div>;
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => (file.preview ? URL.revokeObjectURL(file.preview) : null));
    },
    [files]
  );

  return (
    <div className="">
      <div
        className="custom-dnd-zone"
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        <p>{_text}</p>
        <A11yButton
          elementType="aside"
          className="thumbs-container"
          onClick={(event) => event.stopPropagation()}
        >
          {thumbs}
        </A11yButton>
      </div>
    </div>
  );
};

DragAndDrop.defaultProps = {
  maxFiles: 1,
  types: [],
};

export default React.memo(DragAndDrop);
