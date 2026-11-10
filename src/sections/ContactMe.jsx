import { Bvh } from '@react-three/drei';
import * as THREE from 'three';
import TextAdvance from '../components/TextAdvance';
import fontTitle from '../assets/fonts/Encode_Sans_Semi_Expanded/Encode_Sans_Semi_Expanded_Bold.json';
import fontText from '../assets/fonts/Source_Code_Pro/static/Source_Code_Pro_Regular.json';
import Text3DForm from '../components/Text3DForm';
import { Box1 } from '../models/Box1';
import { Box2 } from '../models/Box2';
import { Send } from '../models/Send';
import { Iphone } from '../models/Iphone';

const CONTACT_SECONDARY_COLOR = new THREE.Color(0x223060);
const CONTACT_TEXT_COLOR = new THREE.Color(0x424050);
const CONTACT_TITLE_COLOR = new THREE.Color(0x333333);

function TextLabel({ position, text }) {
  return (
    <TextAdvance
      position={position}
      align="left"
      text={text}
      font={fontText}
      size={0.16}
      height={0.05}
      colorPri="white"
      colorSec={CONTACT_SECONDARY_COLOR}
    />
  );
}

function ContactTitle() {
  return (
    <TextAdvance
      position={[0, 0, 0]}
      text="CONTACT ME"
      font={fontTitle}
      size={0.3}
      height={0.1}
      colorPri="white"
      colorSec={CONTACT_TITLE_COLOR}
    />
  );
}

function ContactMe({
  isVisibleLight,
  pos,
  scrollValue,
  userName,
  userEmail,
  message,
  feedback,
  colorFeedback,
  changeUserName,
  changeUserEmail,
  changeMessage,
  typeForm,
  changeTypeForm,
  form1Ref,
  form2Ref,
  form3Ref,
  sendFormRef,
}) {
  const visible = isVisibleLight(new THREE.Vector3(0, 5, pos[2]), 11);
  const feedbackColor = new THREE.Color(colorFeedback);

  return (
    <mesh className="CONTACT ME" position={pos} visible={visible}>
      {/* <rectAreaLight intensity={15} position={[0, 2, 3]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={5} color={CONTACT_SECONDARY_COLOR} /> */}
      <ContactTitle />

      <mesh className="Name" position={[-3.5, 0, 0.8]}>
        <TextLabel position={[0, -0.01, 0.15]} text="Name" />
        <Text3DForm
          position={[-0.2, 0.04, 0.6]}
          align="left"
          id={1}
          typeForm={typeForm}
          change={changeTypeForm}
          font={fontText}
          size={0.14}
          height={0.05}
          text={userName}
          setText={changeUserName}
          colorPri={CONTACT_TEXT_COLOR}
          isEditable={true}
        />
        <Box1 ref={form1Ref} position={[-2, -0.1, 1.13]} scale={[20, 20, 15]} />
      </mesh>

      <mesh className="E-mail" position={[-3.5, 0, 1.9]}>
        <TextLabel position={[0, -0.01, 0.15]} text="E-mail" />
        <Text3DForm
          position={[-0.2, 0.04, 0.6]}
          align="left"
          id={2}
          typeForm={typeForm}
          change={changeTypeForm}
          font={fontText}
          size={0.14}
          height={0.05}
          text={userEmail}
          setText={changeUserEmail}
          colorPri={CONTACT_TEXT_COLOR}
          isEditable={true}
        />
        <Box1 ref={form2Ref} position={[-2, -0.1, 1.13]} scale={[20, 20, 15]} />
      </mesh>

      <mesh className="Message" position={[-3.5, 0, 3]}>
        <TextLabel position={[0, -0.01, 0.15]} text="Message" />
        <Text3DForm
          position={[-0.15, 0.04, 0.6]}
          align="left"
          id={3}
          typeForm={typeForm}
          change={changeTypeForm}
          text={message}
          setText={changeMessage}
          font={fontText}
          size={0.14}
          height={0.05}
          textParagraph={true}
          maxLengthCharacters={140}
          colorPri={CONTACT_TEXT_COLOR}
          isEditable={true}
        />
        <Box2 ref={form3Ref} position={[-2, -0.1, 1.2]} scale={[20, 20, 16]} />
      </mesh>

      <TextAdvance
        position={[-3.5, -0.01, 5.3]}
        align="left"
        text={feedback}
        font={fontText}
        size={0.16}
        height={0.05}
        colorPri={feedbackColor}
        colorSec={CONTACT_SECONDARY_COLOR}
      />

      <mesh className="Iphone" position={[0, 0, 0]}>
        <Bvh firstHitOnly>
          <Send ref={sendFormRef} scale={20} position={[0.5, -0.08, 4.6]} rotation={[0, 0, 0]} />
          <Iphone position={[2, 0.68, 3]} rotation={[0, 0, (scrollValue * Math.PI) / 1200 + 0.3]} scale={1.5} />
        </Bvh>
      </mesh>
    </mesh>
  );
}

export default ContactMe;
