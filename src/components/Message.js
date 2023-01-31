function Message({ message }) {
  return <p className="message">{message ? message : "Loading..."}</p>;
}

export default Message;
