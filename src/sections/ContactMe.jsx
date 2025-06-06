import { useMemo } from 'react';
import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import Text3DForm from '../components/Text3DForm';
import { Box1 } from '../../public/models/Box1';
import { Box2 } from '../../public/models/Box2';
import { Send } from '../../public/models/Send';
import { Iphone } from '../../public/models/Iphone';

function ContactMe({
  isVisibleLight, pos, scrollValue, userName, userEmail, message, feedback, colorFeedback,
  changeUserName, changeUserEmail, changeMessage, typeForm, changeTypeForm, form1Ref, form2Ref, form3Ref, sendFormRef
}) {

  // Memoized static components
  const nameLabel = useMemo(() => (
    <TextAdvance position={[0, -0.01, 0.15]} align="left"
      text={"Name"}
      font={fontText} size={0.16} height={0.05}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const emailLabel = useMemo(() => (
    <TextAdvance position={[0, -0.01, 0.15]} align="left"
      text={"E-mail"}
      font={fontText} size={0.16} height={0.05}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const messageLabel = useMemo(() => (
    <TextAdvance position={[0, -0.01, 0.15]} align="left"
      text={"Message"}
      font={fontText} size={0.16} height={0.05}
      colorPri={"white"} colorSec={new THREE.Color(0x223060)}
    />
  ), []);

  const contactTitle = useMemo(() => (
    <TextAdvance position={[0, 0, 0]}
      text={"CONTACT ME"}
      font={fontTitle} size={0.3} height={0.1}
      colorPri={new THREE.Color(0xdddddd)} colorSec={new THREE.Color(0x333333)}
    />
  ), []);

  const rectLight = useMemo(() => (
    <rectAreaLight intensity={15} position={[0, 2, 3]} rotation={[-Math.PI / 2, 0, 0]}
      width={8} height={5} color={new THREE.Color(0x223060)} />
  ), []);

  // Memoized meshes that only depend on props
  const nameMesh = useMemo(() => (
    <mesh className="Name" position={[-3.5, 0, 0.8]}>
      {nameLabel}
      <Text3DForm position={[-0.2, 0.04, 0.6]} align="left"
        id={1} typeForm={typeForm} change={changeTypeForm}
        font={fontText} size={0.14} height={0.05} text={userName} setText={changeUserName}
        colorPri={new THREE.Color(0x424050)} isEditable={"true"}
      />
      <Box1 ref={form1Ref} position={[-2, -0.1, 1.13]} scale={[20, 20, 15]} />
    </mesh>
  ), [nameLabel, typeForm, changeTypeForm, userName, changeUserName, form1Ref]);

  const emailMesh = useMemo(() => (
    <mesh className="E-mail" position={[-3.5, 0, 1.9]}>
      {emailLabel}
      <Text3DForm position={[-0.2, 0.04, 0.6]} align="left"
        id={2} typeForm={typeForm} change={changeTypeForm}
        font={fontText} size={0.14} height={0.05} text={userEmail} setText={changeUserEmail}
        colorPri={new THREE.Color(0x424050)} isEditable={"true"}
      />
      <Box1 ref={form2Ref} position={[-2, -0.1, 1.13]} scale={[20, 20, 15]} />
    </mesh>
  ), [emailLabel, typeForm, changeTypeForm, userEmail, changeUserEmail, form2Ref]);

  const messageMesh = useMemo(() => (
    <mesh className="Message" position={[-3.5, 0, 3]}>
      {messageLabel}
      <Text3DForm position={[-0.15, 0.04, 0.6]} align="left"
        id={3} typeForm={typeForm} change={changeTypeForm} text={message} setText={changeMessage}
        font={fontText} size={0.14} height={0.05} textParagraph={true} maxLengthCharacters={140}
        colorPri={new THREE.Color(0x424050)} isEditable={"true"}
      />
      <Box2 ref={form3Ref} position={[-2, -0.1, 1.2]} scale={[20, 20, 16]} />
    </mesh>
  ), [messageLabel, typeForm, changeTypeForm, message, changeMessage, form3Ref]);

  const feedbackText = useMemo(() => (
    <TextAdvance position={[-3.5, -0.01, 5.3]} align="left"
      text={feedback}
      font={fontText} size={0.16} height={0.05}
      colorPri={new THREE.Color(colorFeedback)} colorSec={new THREE.Color(0x223060)}
    />
  ), [feedback, colorFeedback]);

  const iphoneMesh = useMemo(() => (
    <mesh className="Iphone" position={[0, 0, 0]}>
      <Bvh firstHitOnly >
        <Send ref={sendFormRef} scale={20} position={[0.5, -0.08, 4.6]} rotation={[0, 0, 0]} />
        <Iphone position={[2, 0.68, 3]} rotation={[0, 0, scrollValue * Math.PI / 1200 + 1.4]} scale={1.5} />
      </Bvh>
    </mesh>
  ), [sendFormRef, scrollValue]);

  return (
    <mesh className="CONTACT ME" position={pos} visible={isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 11)}>
      {rectLight}
      {contactTitle}
      {nameMesh}
      {emailMesh}
      {messageMesh}
      {feedbackText}
      {iphoneMesh}
    </mesh>
  );
}

export default ContactMe;
