import React, { useEffect, useState } from "react";
import on from "./img/on.png";
import off from "./img/off.png";
import mqtt from "mqtt";
import { Switch, TextInput } from "@mantine/core";

const App = () => {
  const [switchCheck, setSwitchCheck] = useState();
  const [batteryCheck, setBatteryCheck] = useState();
  const [sCheck, setSCheck] = useState();
  const [bCheck, setBCheck] = useState();

  const client = mqtt.connect(
    "wss://htookhant:Admin123@f6ce8c16ab1f4b958a2179d249d62bf3.s2.eu.hivemq.cloud:8884/mqtt"
  );

  useEffect(() => {
    sCheck ? client.publish("switch", "on") : client.publish("switch", "off");
  }, [sCheck]);

  useEffect(() => {
    bCheck
      ? client.publish("battery", "connected")
      : client.publish("battery", "disconnected");
  }, [bCheck]);

  client.on("connect", () => {
    client.subscribe("switch", (err) => {
      err && console.log(err);
    });
    client.subscribe("battery", (err) => {
      err && console.log(err);
    });
  });

  console.log(sCheck, bCheck);

  // useEffect(() => {
    const handleCheck = (topic, message) => {
      const text = message.toString();
      topic == "switch" && setSwitchCheck(text);
      topic == "battery" && setBatteryCheck(text);
      if ((topic == "switch") & (text == "on")) {
        setSCheck(true);
      } else if ((topic == "switch") & (text == "off")) {
        setSCheck(false);
      }
      if ((topic == "battery") & (text == "connected")) {
        setBCheck(true);
      } else if ((topic == "battery") & (text == "disconnected")) {
        setBCheck(false);
      }
      // topic == "switch" && setSwitchCheck();
      // topic == "battery" && setBatteryCheck();
      // console.log(topic, text);
    };
    client.on("message", handleCheck);
    // return () => {
    //   client.end(); // Cleanup: Ensure client is closed when the component unmounts
    //   client.removeListener("message", handleCheck); // Remove the listener on unmount
    // };
  // }, [sCheck, bCheck]);

  // useEffect(() => {
  //   client.on("message", (topic, message) => {
  //     const text = message.toString();
  //     topic == "switch" && setSwitchCheck(text);
  //     topic == "battery" && setBatteryCheck(text);
  //     console.log(topic, text);
  //   });
  // }, []);
  console.log("9888888");
  console.log(switchCheck);
  console.log(batteryCheck);
  console.log("9888888");

  return (
    <>
      <div className="flex justify-center flex-col gap-16 pt-10 bg-gray-100 items-center h-screen">
        {switchCheck == "on" && batteryCheck == "connected" ? (
          <img src={on} className="w-[20%]" alt="on" />
        ) : (
          <img src={off} className="w-[20%]" alt="off" />
        )}
        <div className=" flex gap-4 justify-center bg-[#fafafa] items-center shadow-2x mb-20 px-20 shadow-green-500/30 p-8 shadow-2xl  pt-6 rounded-md flex-col ">
          <div className="text-2xl font-semibold font-serif text-gray-500">
            Control Center
          </div>
          <div className="w-full  flex gap-5 justify-center">
            <div className=" bg-white shadow-lg shadow-green-500/20 flex gap-2 flex-col items-center p-4 w-[120px] rounded-md">
              <div className="text-xl font-mono font-semibold text-gray-500">
                Switch
              </div>
              <Switch
                checked={sCheck}
                onChange={(event) => setSCheck(event.currentTarget.checked)}
                size="xl"
                color="rgba(107, 242, 73, 1)"
                onLabel="ON"
                offLabel="OFF"
              />
            </div>
            <div className="bg-white flex shadow-lg  shadow-green-500/20 gap-2 flex-col items-center p-4 w-[120px] rounded-md">
              <div className="text-xl font-mono font-semibold text-gray-500">
                Battery
              </div>
              <Switch
                checked={bCheck}
                onChange={(event) => setBCheck(event.currentTarget.checked)}
                size="xl"
                color="rgba(107, 242, 73, 1)"
                onLabel="ON"
                offLabel="OFF"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
