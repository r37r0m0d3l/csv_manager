const Uppy = require('@uppy/core');
const Dashboard = require('@uppy/dashboard');
const XHRUpload = require('@uppy/xhr-upload');
const ProgressBar = require('@uppy/progress-bar');

const uppy = Uppy({
  autoProceed: true,
  debug: true,
  restrictions: {
    allowedFileTypes: ['text/csv'],
    maxFileSize: 300000,
    maxNumberOfFiles: 1,
    minNumberOfFiles: 1,
  },
});

uppy.use(Dashboard, {
  height: 384,
  hideCancelButton: false,
  hideProgressAfterFinish: false,
  inline: true,
  proudlyDisplayPoweredByUppy: false,
  showProgressDetails: true,
  target: '#drag-drop-area',
  width: 384,
});

uppy.use(ProgressBar, {
  fixed: true,
  hideAfterFinish: true,
  target: 'body',
});

uppy.use(XHRUpload, {
  bundle: true,
  endpoint: '/accounts',
  fieldName: 'file',
  limit: 1,
});

uppy.on('complete', result => {
  console.log(
    'Upload complete! We’ve uploaded these files:',
    result.successful,
  );
  setTimeout(() => {
    uppy.reset();
  }, 1e4);
});
