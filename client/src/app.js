// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';

import TreeBuilder from './tree/tree-builder';

import type {NodeMapType, NodeType, StateType} from './types';

import './app.css';

type PropsType = {
  editedName: string,
  editingNode: NodeType,
  instanceName: string,
  instanceNodeMap: NodeMapType,
  typeName: string,
  typeNodeMap: NodeMapType
};

class App extends Component<PropsType> {

  render() {
    const {
      editedName,
      editingNode,
      instanceName,
      instanceNodeMap,
      typeName,
      typeNodeMap
    } = this.props;

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">SmartDevice</h1>
        </header>
        <TreeBuilder
          editedName={editedName}
          editingNode={editingNode}
          kind="type"
          newNodeName={typeName}
          nodeMap={typeNodeMap}
        />
        <TreeBuilder
          editedName={editedName}
          editingNode={editingNode}
          kind="instance"
          newNodeName={instanceName}
          nodeMap={instanceNodeMap}
        />
      </div>
    );
  }
}

const mapState = (state: StateType): Object => {
  const {
    instanceNodeMap,
    typeNodeMap,
    ui: {editedName, editingNode, instanceName, typeName}
  } = state;
  return {
    editedName,
    editingNode,
    instanceName,
    instanceNodeMap,
    typeName,
    typeNodeMap
  };
};

export default connect(mapState)(App);
