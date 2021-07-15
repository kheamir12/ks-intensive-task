import React from "react";
import "./Modal.css";

class Modal extends React.Component {
  clickEvent(e) {
    if (e.target.classList.contains("modal")) {
      this.props.handler({ photo: null });
    }
  }

  render() {
    let photo = this.props.photo;
    if (photo !== null) {
      return (
        <div className="modal" onClick={(e) => this.clickEvent(e)}>
          <img src={photo.img} alt=""></img>
        </div>
      );
    } else return <></>;
  }
}

export default Modal;
