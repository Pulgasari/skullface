# Docs

## The Bridge (RPC)

```javascript
window.__skullface__
//
skullface
```

```javascript
const saveBtn = document.getElementById("save-btn");

saveBtn?.addEventListener("click", async () => {
  const response = await skullface.rpc("writeFile", {
    path: "./hallo.txt",
    content: "Created with Skullface!"
  });
  
  console.log("Answer from Backend:", response);
});
```

## Plugins

- [hotkeys](plugins/hotkeys.md)
- [router](plugins/router.md)

| ... | Android | FreeabBSD | Linux | Mac | Windows |
|-----|---------|-----------|-------|-----|---------|
| hotkeys |         |           |       |     |x |
| router  |         |           |       |     |x |
