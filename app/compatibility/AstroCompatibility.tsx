"use client"; // Ensure this is at the top

import AstralSign from "../component/AstralSign";
import React, { useState, useEffect } from "react";
import SpawnHeadband from "../component/SpawnHeadband";
import NewDropdownMenu from "../component/NewDropdownMenu"; // Adjust path if necessary

// Import compatibility data from a local JSON file
import compatibilityData from "./compatibility.json"; // Adjust path if necessary

// Type definition based on updated JSON structure
type CompatibilityData = {
  compatibility: {
    [key: string]: {
      [key: string]: number; // Compatibility percentage
    };
  };
};

export default function AstroDropDownMenu({
  data,
}: {
  data: [string, string][];
}) {
  // create a list of data name
  const name: string[] = data.map((customer) => customer[0]);
  const [compatibility, setCompatibility] = useState<number | null>(null);
  const [selectedValue1, setSelectedValue1] = useState<string>("");
  const [selectedValue2, setSelectedValue2] = useState<string>("");
  const contabilityCalcul = useEffect(() => {
    if (selectedValue1 && selectedValue2) {
      const dataCompability: CompatibilityData = compatibilityData;
      const percentage =
        dataCompability.compatibility[
          (selectedValue1 &&
            data[
              data.findIndex((customer) => customer[0] === selectedValue1)
            ])[1]
        ]?.[
          (selectedValue2 &&
            data[
              data.findIndex((customer) => customer[0] === selectedValue2)
            ])[1]
        ] || null;
      setCompatibility(percentage);
    }
  }, [selectedValue1, selectedValue2]);

  if (selectedValue1 && selectedValue2) {
    contabilityCalcul;
  }
  const updateSelectedValue1 = (selectedValue: string): void => {
    setSelectedValue1(selectedValue);
  };

  const updateSelectedValue2 = (selectedValue: string): void => {
    setSelectedValue2(selectedValue);
  };

  let sign1 =
    selectedValue1 &&
    data[data.findIndex((customer) => customer[0] === selectedValue1)][1];
  let sign2 =
    selectedValue2 &&
    data[data.findIndex((customer) => customer[0] === selectedValue2)][1];

  return (
    <SpawnHeadband title="Compatibility">
      <div className="flex flex-col space-y-4 bg-white shadow-md rounded-md p-4">
        <h2 className="text-lg font-medium">Select Two Astrological Signs</h2>

        <div className="flex justify-evenly flex-wrap">
          <div>
            <div className="flex">
              <label className="block mb-1 text-sm">First Sign: </label>
              {AstralSign({ astralSign: sign1 })}
              <p> {sign1} </p>
              {AstralSign({ astralSign: sign1 })}
            </div>
            <NewDropdownMenu
              options={name}
              updateSelectedValue={updateSelectedValue1}
            />
          </div>

          <div>
            <div className="flex">
              <label className="block mb-1 text-sm">Second Sign: </label>
              {AstralSign({ astralSign: sign2 })}
              <p> {sign2} </p>
              {AstralSign({ astralSign: sign2 })}
            </div>
            <NewDropdownMenu
              options={name}
              updateSelectedValue={updateSelectedValue2}
            />
          </div>
        </div>

        {selectedValue1 && selectedValue2 && (
          <div>
            <h3 className="text-md font-medium">Compatibility Result:</h3>
            {compatibility !== null ? (
              compatibility > 50 ? (
                <p className="text-green-600">
                  Compatibility: {compatibility}%
                </p>
              ) : (
                <p className="text-red-600">Compatibility: {compatibility}%</p>
              )
            ) : (
              <p className="text-gray-600">No compatibility data available.</p>
            )}
          </div>
        )}
      </div>
    </SpawnHeadband>
  );
}