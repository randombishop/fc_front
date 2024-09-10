import React from 'react';
import { TextureLoader, SRGBColorSpace, SpriteMaterial, Sprite } from 'three';
import { ForceGraph3D } from 'react-force-graph';
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
      const imgTexture = new TextureLoader().load(url);
      imgTexture.colorSpace = SRGBColorSpace;
      const material = new SpriteMaterial({ map: imgTexture });
      const sprite = new Sprite(material);
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