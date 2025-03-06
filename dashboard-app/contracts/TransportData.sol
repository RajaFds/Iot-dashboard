// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TransportData {
    struct Transport {
        string product;
        string vehicle;
        string location;
        uint temperature;
        uint humidity;
        string timestamp;
    }

    Transport[] public transports;

    function addTransport(
        string memory _product,
        string memory _vehicle,
        string memory _location,
        uint _temperature,
        uint _humidity,
        string memory _timestamp
    ) public {
        transports.push(Transport(_product, _vehicle, _location, _temperature, _humidity, _timestamp));
    }

    function getTransports() public view returns (Transport[] memory) {
        return transports;
    }
}
