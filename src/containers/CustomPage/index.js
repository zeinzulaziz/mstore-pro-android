import React, {PureComponent} from 'react';
import wp from '@services/PostAPI';
import WebView from '@components/WebView/WebView';

export default class CustomPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {html: ''};
    this.fetchPage = this.fetchPage.bind(this);
  }

  componentDidMount() {
    this.fetchPage(this.props.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.fetchPage(nextProps.id);
  }

  fetchPage(id) {
    wp.pages()
      .id(id)
      .get((_err, data) => {
        if (data) {
          this.setState({
            html:
              typeof data.content.rendered !== 'undefined'
                ? data.content.rendered
                : 'Content is updating',
          });
        }
      });
  }

  render() {
    return <WebView html={this.state.html} />;
  }
}
