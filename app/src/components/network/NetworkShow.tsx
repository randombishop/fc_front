import React from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';
import Panel from '../common/Panel';
import Loading from '../common/Loading';
import { getBackendUrl } from '../../utils';


class NetworkShow extends React.Component< {data: any, loading: boolean}> {
  
  render() {
    if (this.props.loading) {
      return <Loading /> ;
    }
    const data = this.props.data ;
    if (!data || !data.nodes || !data.links) {
      return null ;
    }
    const nodes = data.nodes ;
    const links = data.links ;
    const num_users = nodes.length ;
    const num_links = links.length ;
    const connectivity = 100 * num_links / (num_users * (num_users - 1)) ;
    const title = `Num users: ${num_users} - Num links: ${num_links} - Connectivity: ${connectivity.toFixed(2)}%` ;
    const defaultAvatar = '/avatar_empty.png'
    const nodeObject = (node:any) => {
      const url = node.pfp ? getBackendUrl() + '/avatars/transform.png?url=' + node.pfp : defaultAvatar ;
      const imgTexture = new THREE.TextureLoader().load(url);
      imgTexture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({ map: imgTexture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(12, 12, 12);
      return sprite;
    }


    return (
      <Panel title={title} backgroundColor="#000011">
        <ForceGraph3D graphData={data} 
            width={1000} height={500} 
            nodeLabel="name"
            nodeThreeObject={nodeObject}
            nodeRelSize={12}
            linkCurvature={0.25}
          />
      </Panel>
    );
  }

}

export default NetworkShow;