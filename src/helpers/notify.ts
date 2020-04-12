import notifier from "node-notifier";

function notify(message: string, title?: string, callback?: Function, toast = false): void {
  if (!toast) {
    callback();
    return;
  }
  notifier.notify(
    {
      message,
      sound: true,
      title,
      wait: false,
    },
    callback,
  );
}

export { notify };
