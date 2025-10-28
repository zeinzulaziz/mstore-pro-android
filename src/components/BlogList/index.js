import React, {PureComponent} from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {TouchableScale} from '@components';
import {Constants, Tools} from '@common';
import styles from './styles';
import HHeader from './HHeader';

class BlogList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const {config} = this.props;
    this.props.fetchNews(config.limit, config.page);
  }

  gotoListNews = () => {
    const {navigation} = this.props;
    navigation.navigate('NewsScreen');
  };

  renderItem = ({item, index}) => {
    const {theme} = this.props;
    const {text} = theme.colors;

    let imageURL = '',
      postTitle = '';
    imageURL = Tools.getImage(item, Constants.PostImage.large);
    postTitle =
      typeof item.title !== 'undefined'
        ? Tools.getDescription(item.title.rendered, 300)
        : '';

    return (
      <TouchableScale
        key={`${item.id}`}
        style={styles.card}
        onPress={() => {
          this.props.navigation.navigate('NewsDetailScreen', {post: item});
        }}>
        <Image
          source={{uri: imageURL}}
          style={styles.imagePanelOne}
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error)}
        />
        <View style={styles.title}>
          <Text style={[styles.labelText, {color: text}]}>{postTitle}</Text>
        </View>
      </TouchableScale>
    );
  };
  render() {
    const {news, config, theme} = this.props;
    const {text, background} = theme.colors;

    console.log('=== BlogList Render ===');
    console.log('News items count:', news?.length || 0);
    console.log('Config:', config);

    return (
      <View style={[styles.container, {backgroundColor: background}]}>
        <HHeader
          config={config}
          theme={theme}
          gotoListNews={this.gotoListNews}
        />
        <FlatList
          data={news}
          contentContainerStyle={styles.flatlist}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `blog-vertical-${item.id}-${Date.now()}`}
          renderItem={this.renderItem}
          numColumns={1}
          horizontal={false}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}

export default BlogList;
