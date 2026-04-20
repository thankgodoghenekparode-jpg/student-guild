function queueNotification(notification) {
  return {
    status: "queued-placeholder",
    notification
  }
}

module.exports = { queueNotification }
