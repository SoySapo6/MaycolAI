const path = require("node:path");
const fs = require("node:fs");

const databasePath = path.resolve(__dirname);

const FILES = {
  INACTIVE_GROUPS: "inactive-groups",
  NOT_WELCOME_GROUPS: "not-welcome-groups",
  ANTI_LINK_GROUPS: "anti-link-groups",
};

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

function readJSON(fileName) {
  const filePath = path.resolve(databasePath, `${fileName}.json`);
  ensureFileExists(filePath);

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJSON(fileName, data) {
  const filePath = path.resolve(databasePath, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

function addGroup(fileName, groupId) {
  const groups = readJSON(fileName);

  if (!groups.includes(groupId)) {
    groups.push(groupId);
    writeJSON(fileName, groups);
  }
}

function removeGroup(fileName, groupId) {
  const groups = readJSON(fileName);
  const index = groups.indexOf(groupId);

  if (index !== -1) {
    groups.splice(index, 1);
    writeJSON(fileName, groups);
  }
}

function isGroupActive(fileName, groupId, invert = true) {
  const groups = readJSON(fileName);

  return invert ? !groups.includes(groupId) : groups.includes(groupId);
}

exports.activateGroup = (groupId) =>
  removeGroup(FILES.INACTIVE_GROUPS, groupId);

exports.deactivateGroup = (groupId) => addGroup(FILES.INACTIVE_GROUPS, groupId);

exports.isActiveGroup = (groupId) =>
  isGroupActive(FILES.INACTIVE_GROUPS, groupId);

exports.activateWelcomeGroup = (groupId) =>
  removeGroup(FILES.NOT_WELCOME_GROUPS, groupId);

exports.deactivateWelcomeGroup = (groupId) =>
  addGroup(FILES.NOT_WELCOME_GROUPS, groupId);

exports.isActiveWelcomeGroup = (groupId) =>
  isGroupActive(FILES.NOT_WELCOME_GROUPS, groupId);

exports.activateAntiLinkGroup = (groupId) =>
  addGroup(FILES.ANTI_LINK_GROUPS, groupId);

exports.deactivateAntiLinkGroup = (groupId) =>
  removeGroup(FILES.ANTI_LINK_GROUPS, groupId);

exports.isActiveAntiLinkGroup = (groupId) =>
  isGroupActive(FILES.ANTI_LINK_GROUPS, groupId, false);
  
exports.activateGoodbyeGroup = (groupId) =>
  removeGroup(FILES.NOT_GOODBYE_GROUPS, groupId);

exports.deactivateGoodbyeGroup = (groupId) =>
  addGroup(FILES.NOT_GOODBYE_GROUPS, groupId);

exports.isActiveGoodbyeGroup = (groupId) =>
  isGroupActive(FILES.NOT_GOODBYE_GROUPS, groupId);