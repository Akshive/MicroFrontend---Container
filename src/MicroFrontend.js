import React from "react";

class MicroFrontend extends React.Component {
  render() {
    return <main id={`${this.props.name}-container`} />;
  }

  componentDidMount() {
    const { name, host, document } = this.props;
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      this.renderMicroFrontend();
      return;
    }

    fetch(`${host}/asset-manifest.json`)
      .then((res) => res.json())
      .then((manifest) => {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `${host}${manifest["main.js"]}`;
        script.onload = this.renderMicroFrontend;
        document.head.appendChild(script);
      });
  }

  componentWillUnmount() {
    const { name, window } = this.props;
    try {
      window[`unmount${name}`](`${name}-container`);
    } catch (ex) {
      console.log(ex);
    }
  }

  renderMicroFrontend = () => {
    const { name, history, window } = this.props;

    // renders the required microfrontend
    // e.g. window.renderBrowse('browse-container', history);
    // The signature of this global function is the key contract between
    // the container application and the micro frontends.
    window[`render${name}`](`${name}-container`, history);
  };
}

MicroFrontend.defaultProps = {
  document,
  window,
};

export default MicroFrontend;
