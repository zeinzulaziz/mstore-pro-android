import { isEmpty } from 'lodash';
import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Fonts } from '@common';

const Input = props => {
  return <StandardTextInput {...props} />;
};

const StandardTextInput = props => {
  if (props.label) {
    return (
      <View style={[styles.viewInput, props.viewInputStyle]}>
        <Text style={[styles.label, props.labelStyle]}>{props.label}</Text>

        <TextInput
          style={[styles.textinput, props.inputStyle]}
          placeholderTextColor="#C7C7C7"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          {...props}
        />
        {props.error && !isEmpty(props.error) && (
          <Text style={[styles.error, props.errorStyle]}>{props.error}</Text>
        )}
      </View>
    );
  }

  return (
    <TextInput
      style={[styles.textinput, props.inputStyle]}
      placeholderTextColor="#C7C7C7"
      autoCorrect={false}
      underlineColorAndroid="transparent"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  viewInput: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 3,
    fontFamily: Fonts.medium,
  },
  textinput: {
    height: 40,
    textAlign: 'left',
    borderColor: '#d4dce1',
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    backgroundColor: '#F6F7F9',
    fontFamily: Fonts.regular,
  },
  error: {
    color: 'red',
    marginLeft: 3,
    fontFamily: Fonts.regular,
  },
});

export default Input;
