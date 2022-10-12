(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{75557:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(5432)}])},47541:function(e,t,n){"use strict";var a=n(7297),s=n(31230);function r(){var e=(0,a.Z)(['\n  {\n    activeItems(\n      first: 1000\n      where: { buyer: "0x0000000000000000000000000000000000000000" }\n    ) {\n      id\n      buyer\n      seller\n      nftAddress\n      tokenId\n      price\n    }\n  }\n']);return r=function(){return e},e}var i=(0,s.Ps)(r());t.Z=i},5432:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return V}});var a=n(47568),s=n(70655),r=n(85893),i=n(214),o=n.n(i),c=JSON.parse('[{"type":"constructor","payable":false,"inputs":[]},{"type":"error","name":"NftMarketplace__AlreadyListed","inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"}]},{"type":"error","name":"NftMarketplace__NoProceeds","inputs":[]},{"type":"error","name":"NftMarketplace__NotApprovedForMarketplace","inputs":[]},{"type":"error","name":"NftMarketplace__NotListed","inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"}]},{"type":"error","name":"NftMarketplace__NotOwner","inputs":[]},{"type":"error","name":"NftMarketplace__PriceMustBeAboveZero","inputs":[]},{"type":"error","name":"NftMarketplace__PriceNotMet","inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"},{"type":"uint256","name":"price"}]},{"type":"error","name":"NftMarketplace__TransferFailed","inputs":[]},{"type":"event","anonymous":false,"name":"ItemBought","inputs":[{"type":"address","name":"buyer","indexed":true},{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"tokenId","indexed":true},{"type":"uint256","name":"price","indexed":false}]},{"type":"event","anonymous":false,"name":"ItemCanceled","inputs":[{"type":"address","name":"seller","indexed":true},{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}]},{"type":"event","anonymous":false,"name":"ItemListed","inputs":[{"type":"address","name":"seller","indexed":true},{"type":"address","name":"nftAddress","indexed":true},{"type":"uint256","name":"tokenId","indexed":true},{"type":"uint256","name":"price","indexed":false}]},{"type":"function","name":"buyItem","constant":false,"stateMutability":"payable","payable":true,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"cancelListing","constant":false,"payable":false,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"getListing","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"tuple","components":[{"type":"uint256","name":"price"},{"type":"address","name":"seller"}]}]},{"type":"function","name":"getProceeds","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"user"}],"outputs":[{"type":"uint256","name":"proceeds"}]},{"type":"function","name":"listItem","constant":false,"payable":false,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"},{"type":"uint256","name":"price"}],"outputs":[]},{"type":"function","name":"updateListing","constant":false,"payable":false,"inputs":[{"type":"address","name":"nftAddress"},{"type":"uint256","name":"tokenId"},{"type":"uint256","name":"newPrice"}],"outputs":[]},{"type":"function","name":"withdrawProceeds","constant":false,"payable":false,"inputs":[],"outputs":[]}]'),l=n(67225),u=n(25675),d=n.n(u),p=n(4774),m=n(82369),f=n(71577),y=n(86856),h=n(40044),x=n(45605),v=n(10133),g=n(55678),b=n(67976),N=n(61744),k=n(67294);function j(e){var t=e.props,n=e.isVisible,i=e.hideModal,o=this,c=function(e,t){"updateListing"===t&&U(),"cancelListing"===t&&G(),V(!0),e&&e.stopPropagation()},l=function(e){console.log(e),"ACTION_REJECTED"===e.code?g.Am.error("Transaction rejected."):g.Am.error("Error updating listing."),u()},u=function(e){i(),V(!1),e&&e.stopPropagation()},d=function(e){M(""===e.target.value?"0":e.target.value),""!==e.target.value&&e.target.value<=0?(L(!1),B("Price must be greater than 0.")):""!==e.target.value&&N.parseEther(e.target.value).toString()===S?(L(!1),B("The new price is the same as the old one.")):""===e.target.value?L(!1):(L(!0),B(""))},j=t.marketplaceAddress,w=t.marketplaceAbi,I=t.nftAddress,A=t.tokenName,E=t.tokenId,S=t.price,T=(0,k.useState)("0"),_=T[0],M=T[1],C=(0,k.useState)(!1),Z=C[0],L=C[1],P=(0,k.useState)(""),F=P[0],B=P[1],O=(0,k.useState)(!1),D=O[0],V=O[1],Y=(0,b.yL)().network,J=(0,p.N)(j,w,"updateListing",[I,E,N.parseEther(_)],{onSuccess:W,onError:l},n&&I&&""!==E&&_&&"0"!==_),U=J.write,R=J.isLoading,q=(0,p.N)(j,w,"cancelListing",[I,E],{onSuccess:W,onError:l},n&&I&&""!==E),G=q.write,H=q.isLoading;function W(e){return X.apply(this,arguments)}function X(){return(X=(0,a.Z)(function(e){return(0,s.__generator)(this,function(t){switch(t.label){case 0:return[4,g.Am.promise(e.wait(1),{pending:"Updating listing...",success:"Listing updated!",error:"Error updating listing."})];case 1:return t.sent(),u(),M("0"),[2]}})})).apply(this,arguments)}return(0,r.jsx)(m.Z,{title:"Update Listing",open:n,onOk:function(e){return c(e,"updateListing")},onCancel:u,onClose:u,okText:"Update",footer:[(0,r.jsx)(f.Z,{type:"primary",danger:!0,loading:H||D,onClick:function(e){return c(e,"cancelListing")},children:"Cancel listing"},"unlist"),(0,r.jsxs)("div",{className:"wrap-btn",children:[(0,r.jsx)(f.Z,{onClick:u,children:"Cancel"},"back"),(0,r.jsx)(f.Z,{type:"primary",disabled:!Z,loading:R||D,onClick:function(){return c(o,"updateListing")},children:"Ok"},"submit")]}),],children:(0,r.jsxs)("div",{className:"update-listing",children:[(0,r.jsxs)("div",{className:"title",children:[(0,r.jsxs)("div",{className:"name",children:[A," "]}),(0,r.jsxs)("div",{className:"token-id",children:["#",E]})]}),(0,r.jsx)(y.Z,{type:"number",autoFocus:!0,placeholder:"New price",prefix:"maticmum"===Y.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"icon"}):(0,r.jsx)(v.T,{name:"eth",width:20,style:"icon"}),addonAfter:(0,r.jsx)(h.Z,{title:"Enter the new price (in ".concat("maticmum"===Y.name?"MATIC":"ETH",")"),children:(0,r.jsx)(x.Z,{style:{color:"rgba(255,255,255,.75)"}})}),onChange:d,min:0}),(0,r.jsx)("div",{className:"error-message",children:F})]})})}var w=function(e){var t;return Number(parseFloat(N.formatUnits(e,18)).toFixed(4))},I=n(2593);function A(e){var t=e.props,n=e.isVisible,i=e.hideModal,o=function(e){B(),T(!0),e.stopPropagation()},c=function(e){console.error(e.message),"ACTION_REJECTED"===e.code?g.Am.error("Transaction rejected."):g.Am.error("Error buying item."),l()},l=function(e){i(),T(!1),e&&e.stopPropagation()},u=t.marketplaceAddress,d=t.marketplaceAbi,f=t.nftAddress,y=t.tokenName,h=t.tokenId,x=t.price,N=(0,b.yL)().network,j=(0,b.mA)().address,A=(0,b.KQ)({addressOrName:j}).data,E=(0,k.useState)(!1),S=E[0],T=E[1],_=(0,k.useState)(!0),M=_[0],C=_[1],Z=(0,k.useState)(0),L=Z[0],P=Z[1],F=(0,p.N)(u,d,"buyItem",[f,h,{value:x}],{onSuccess:function(e){return D.apply(this,arguments)},onError:c},n&&f&&""!==h&&x),B=F.write,O=F.isLoading;function D(){return(D=(0,a.Z)(function(e){return(0,s.__generator)(this,function(t){switch(t.label){case 0:return[4,g.Am.promise(e.wait(1),{pending:"Buying item...",success:"Item bought!",error:"Error buying item."})];case 1:return t.sent(),l(),[2]}})})).apply(this,arguments)}return F.isSuccess,(0,k.useEffect)(function(){if(x&&A){var e=I.O$.from(A.value),t=I.O$.from(x);e.lt(t)?(C(!1),P(t.sub(e).toString())):(C(!0),P(0))}},[x]),(0,r.jsx)(m.Z,{title:"Buy item",open:n,onOk:o,onCancel:l,onClose:i,okButtonProps:{loading:O||S,disabled:!M},okText:"Buy",children:(0,r.jsxs)("div",{className:"buy-item",children:[(0,r.jsxs)("div",{className:"title",children:[(0,r.jsxs)("div",{className:"name",children:[y," "]}),(0,r.jsxs)("div",{className:"token-id",children:["#",h]})]}),(0,r.jsx)("div",{className:"price",children:(0,r.jsxs)("div",{className:"value",children:["maticmum"===N.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"color"}):(0,r.jsx)(v.T,{name:"eth",width:20,style:"color"}),w(x)]})}),A?(0,r.jsxs)("div",{className:"balance",children:["You have","maticmum"===N.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"icon"}):(0,r.jsx)(v.T,{name:"eth",width:20,style:"icon"}),(0,r.jsxs)("span",{className:"ether-value",children:[" ",w(A.value.toString())," "]}),"in your wallet."]}):"",!M&&(0,r.jsxs)("div",{className:"error-message",children:["You need"," ",(0,r.jsx)("span",{className:"ether-value",children:w(L)})," ","more ","maticmum"===N.name?"MATIC":"ETH"," to buy this item."]})]})})}var E=n(26303);function S(e){var t,n=e.nftAttributes,i=e.marketplaceAddress,o=function(e){"update"===e?q(!0):"buy"===e&&W(!0)},u=n.nftAddress,m=n.tokenId,f=n.price,y=n.seller,h=(0,b.mA)().address,x=(0,b.yL)().network,N=(0,k.useState)(!1),I=N[0],S=N[1],T=(0,k.useState)(""),_=T[0],M=T[1],C=(0,k.useState)(""),Z=C[0],L=C[1],P=(0,k.useState)(""),F=P[0],B=P[1],O=(0,k.useState)(!1),D=O[0],V=O[1],Y=(0,k.useState)(!1),J=(Y[0],Y[1]),U=(0,k.useState)(!1),R=U[0],q=U[1],G=(0,k.useState)(!1),H=G[0],W=G[1],X=(0,p.p)(u,l,"tokenURI",[m],m);function K(){return $.apply(this,arguments)}function $(){return($=(0,a.Z)(function(){var e,t,n,a;return(0,s.__generator)(this,function(t){switch(t.label){case 0:if(!X)return[3,6];return e={},[4,fetch(X.replace("ipfs://","https://ipfs.io/ipfs/")).catch(function(e){console.log(e)})];case 1:if(!((n=t.sent())&&429===n.status))return[3,2];return console.log("Too many requests"),e.uri="",e.name="",e.description="",S(!1),setTimeout(function(){K()},5e3),[3,5];case 2:if(!n)return[3,4];return[4,n.json()];case 3:return a=t.sent(),e.uri=a.image.replace("ipfs://","https://ipfs.io/ipfs/"),e.name=a.name,e.description=a.description,S(!0),[3,5];case 4:e.uri="",e.name="",e.description="",S(!1),g.Am.error("Error fetching NFT data. Please refresh."),t.label=5;case 5:M(e.uri),L(e.name),B(e.description),t.label=6;case 6:return V(h.toLowerCase()===y.toLowerCase()||void 0===y),[2]}})})).apply(this,arguments)}return(0,k.useEffect)(function(){h&&K(),q(!1),W(!1)},[h]),(0,r.jsxs)("div",{className:"nft-card",onMouseEnter:function(){return J(!0)},onMouseLeave:function(){return J(!1)},onClick:function(){return D?o("update"):o("buy")},children:[(0,r.jsx)(j,{props:{marketplaceAddress:i,marketplaceAbi:c,nftAddress:u,tokenName:Z,tokenId:m,price:f},isVisible:R,hideModal:function(){return q(!1)}},"update-listing-modal"),(0,r.jsx)(A,{props:{marketplaceAddress:i,marketplaceAbi:c,nftAddress:u,tokenName:Z,tokenId:m,price:f},isVisible:H,hideModal:function(){return W(!1)}},"buying-modal"),(0,r.jsx)("div",{className:"image",children:_?(0,r.jsx)(d(),{src:_,loader:function(){return _},unoptimized:!0,width:300,height:300}):(0,r.jsx)(E.Z.Image,{style:{width:300,height:300},loading:!I,active:!0,className:"nft-skeleton"})}),(0,r.jsxs)("div",{className:"properties",children:[(0,r.jsxs)("div",{className:"name",children:[Z," ",(0,r.jsxs)("span",{className:"token-id",children:["#",m]})]}),(0,r.jsx)("div",{className:"description",children:F}),(0,r.jsx)(E.Z,{paragraph:{rows:1},loading:!I,active:!0})]}),(0,r.jsxs)("div",{className:"info",children:[(0,r.jsxs)("div",{className:"price",children:["maticmum"===x.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"color"}):(0,r.jsx)("i",{className:"fa-brands fa-ethereum"}),w(f)]}),(0,r.jsx)("div",{className:"seller",children:D?"You":"".concat(y.slice(0,6),"...").concat(y.slice(-4))})]}),(0,r.jsx)("div",{className:"actions",children:D?(0,r.jsxs)("div",{className:"action-edit-item",children:[(0,r.jsx)("div",{children:"Update"}),(0,r.jsx)("i",{className:"fa-solid fa-pen"})]}):(0,r.jsxs)("div",{className:"action-buy-item",children:[(0,r.jsxs)("div",{children:["Buy"," ","maticmum"===x.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"color"}):(0,r.jsx)("i",{className:"fa-brands fa-ethereum"}),w(f)]}),(0,r.jsx)("i",{className:"fa-solid fa-cart-shopping"})]})})]})}var T=n(48036),_=n(89325),M=n(63750);function C(e){var t=e.isVisible,n=e.hideModal,i=function(){navigator.clipboard.writeText(E),g.Am.info("NFT Contract address copied to clipboard!")},o=function(e){console.error(e.message),"ACTION_REJECTED"===e.code?g.Am.error("Transaction rejected."):g.Am.error("Error listing item."),u()},u=function(e){n(),L(!1),V(!1),U(""),G(""),e&&e.stopPropagation()},d=(0,b.yL)().network,j=(0,k.useState)(null),w=j[0],I=j[1],A=(0,k.useState)(null),E=A[0],S=A[1],C=(0,k.useState)(!1),Z=C[0],L=C[1],P=(0,k.useState)(!1),F=P[0],B=P[1],O=(0,k.useState)(!1),D=O[0],V=O[1],Y=(0,k.useState)(""),J=Y[0],U=Y[1],R=(0,k.useState)(""),q=R[0],G=R[1],H=(0,k.useState)(""),W=H[0],X=H[1],K=(0,k.useState)(""),$=K[0],z=K[1],Q=(0,p.N)(E,l,"approve",[w,J],{onSuccess:function(e){return ec.apply(this,arguments)},onError:o},t&&w&&""!==J),ee=Q.write,et=Q.isLoading,en=(0,p.N)(w,c,"listItem",[E,J,W],{onSuccess:function(e){return el.apply(this,arguments)},onError:o},E&&""!==J&&W),ea=en.write,es=en.isLoading,er=en.refetch;function ei(e,t){return eo.apply(this,arguments)}function eo(){return(eo=(0,a.Z)(function(e,t){return(0,s.__generator)(this,function(n){return"approveMarketplace"!==t||ee?"listItem"!==t||ea?("approveMarketplace"===t&&ee(),"listItem"===t&&ea(),L(!0),e&&e.stopPropagation(),[2]):(g.Am.error("It looks like you have not approved the marketplace yet. Please wait for the approval to go through."),[2]):(g.Am.error("Please check if you own this NFT"),[2])})})).apply(this,arguments)}function ec(){return(ec=(0,a.Z)(function(e){return(0,s.__generator)(this,function(t){switch(t.label){case 0:return[4,g.Am.promise(e.wait(1),{pending:"Approving marketplace...",success:"Item approved for marketplace. You can now list it.",error:"Error approving marketplace."})];case 1:return t.sent(),er(),V(!0),L(!1),[2]}})})).apply(this,arguments)}function el(){return(el=(0,a.Z)(function(e){return(0,s.__generator)(this,function(t){switch(t.label){case 0:return console.log("here"),[4,g.Am.promise(e.wait(1),{pending:"Listing item...",success:"Item listed!",error:"Error listing item."})];case 1:return t.sent(),u(),[2]}})})).apply(this,arguments)}function eu(e,t){return ed.apply(this,arguments)}function ed(){return(ed=(0,a.Z)(function(e,t){var n;return(0,s.__generator)(this,function(n){if(null===e&&B(!1),"tokenId"===t)U(e);else if("price"===t){if(G(e),null===e)return[2];X(N.parseEther(e.toString()).toString())}return[2]})})).apply(this,arguments)}return(0,k.useEffect)(function(){d.chainId&&T[d.chainId]&&(I(T[d.chainId].NftMarketplace[0]||""),S(T[d.chainId].BasicNft[0]||""))},[d.chainId]),(0,k.useEffect)(function(){var e="number"!=typeof q||q<=0||"number"!=typeof J||J<0;e?B(!1):B(!0),e&&""!==q&&""!==J?z("Invalid price or token ID."):z("")},[q,J]),(0,r.jsx)(m.Z,{title:"List item",open:t,onOk:ei,onCancel:u,onClose:n,footer:[(0,r.jsx)(f.Z,{onClick:u,children:"Cancel"},"back"),(0,r.jsxs)("div",{className:"wrap-btn",children:[(0,r.jsx)(f.Z,{type:"primary",disabled:D||!F,loading:et||Z,onClick:function(e){return ei(e,"approveMarketplace")},children:"1 - Approve Marketplace"},"approve"),(0,r.jsx)(f.Z,{type:"primary",disabled:!D,loading:es||Z,onClick:function(e){return ei(e,"listItem")},children:"2 - List Item"},"submit")]}),],okText:"List",children:(0,r.jsxs)("div",{className:"list-item",children:[(0,r.jsxs)("div",{className:"list-address",children:[(0,r.jsx)("label",{htmlFor:"list-address-input",children:"NFT Address"}),(0,r.jsx)(y.Z,{id:"list-address-input",type:"text",value:E,suffix:(0,r.jsxs)("div",{className:"nft-address-tooltip",children:[(0,r.jsx)("i",{className:"fa-solid fa-copy",onClick:i}),(0,r.jsx)(h.Z,{title:"The address of the NFT Contract",children:(0,r.jsx)(x.Z,{style:{color:"rgba(255,255,255,.75)"}})})]}),disabled:!0})]}),(0,r.jsxs)("div",{className:"list-token-id",children:[(0,r.jsx)("label",{htmlFor:"list-token-id-input",children:"Token ID"}),(0,r.jsx)(_.Z,{id:"list-token-id-input",type:"number",autoFocus:!0,placeholder:"0",prefix:(0,r.jsx)(M.nvr,{}),addonAfter:(0,r.jsx)(h.Z,{title:"Enter the ID of the token you want to list",children:(0,r.jsx)(x.Z,{style:{color:"rgba(255,255,255,.75)"}})}),onChange:function(e){return eu(e,"tokenId")},min:0,value:J})]}),(0,r.jsxs)("div",{className:"list-price",children:[(0,r.jsx)("label",{htmlFor:"list-price-input",children:"Price"}),(0,r.jsx)(_.Z,{id:"list-price-input",type:"number",placeholder:"0",prefix:"maticmum"===d.name?(0,r.jsx)("div",{className:"icon-wrapper",children:(0,r.jsx)(v.T,{name:"matic",width:16,style:"icon"})}):(0,r.jsx)("div",{className:"icon-wrapper",children:(0,r.jsx)(v.T,{name:"eth",width:16,style:"icon"})}),addonAfter:(0,r.jsx)(h.Z,{title:"Enter the price for the NFT (in ".concat("maticmum"===d.name?"MATIC":"ETH",")"),children:(0,r.jsx)(x.Z,{style:{color:"rgba(255,255,255,.75)"}})}),onChange:function(e){return eu(e,"price")},min:0,value:q})]}),(0,r.jsx)("div",{className:"error-message",children:$})]})})}function Z(e){var t=e.isVisible,n=e.hideModal,i=function(e){if("0"===E.toString()){g.Am.error("You have no proceeds to withdraw.");return}_(),j(!0),e.stopPropagation()},o=function(e){console.error(e.message),"ACTION_REJECTED"===e.code?g.Am.error("Transaction rejected."):g.Am.error("Error withdrawing proceeds."),l()},l=function(e){n(),j(!1),e&&e.stopPropagation()},u=(0,b.mA)().address,d=(0,b.yL)().network,f=(0,k.useState)(""),y=f[0],h=f[1],x=(0,k.useState)(!1),N=x[0],j=x[1],I=(0,k.useState)(""),A=I[0];I[1];var E=(0,p.p)(y,c,"getProceeds",[u],u),S=(0,p.N)(y,c,"withdrawProceeds",[],{onSuccess:function(e){return C.apply(this,arguments)},onError:o},t&&E&&"0"!==E.toString()),_=S.write,M=S.isLoading;function C(){return(C=(0,a.Z)(function(e){return(0,s.__generator)(this,function(t){switch(t.label){case 0:return[4,g.Am.promise(e.wait(1),{pending:"Withdrawing proceeds...",success:"Proceeds withdrawn!",error:"Error withdrawing proceeds"})];case 1:return t.sent(),l(),[2]}})})).apply(this,arguments)}return(0,k.useEffect)(function(){d.chainId&&T[d.chainId]&&h(T[d.chainId].NftMarketplace[0]||"")},[d.chainId]),(0,r.jsxs)(m.Z,{title:"Withdraw Proceeds",open:t,onOk:i,onCancel:l,onClose:n,okButtonProps:{loading:M||N},okText:"Withdraw",children:[(0,r.jsxs)("div",{className:"withdraw-proceeds",children:[(0,r.jsx)("div",{className:"title",children:"Your proceeds"}),(0,r.jsx)("div",{className:"price",children:(0,r.jsxs)("div",{className:"value",children:["maticmum"===d.name?(0,r.jsx)(v.T,{name:"matic",width:20,style:"icon"}):(0,r.jsx)(v.T,{name:"eth",width:20,style:"icon"}),(0,r.jsx)("span",{children:E&&w(E.toString()||"0")})]})})]}),(0,r.jsx)("div",{className:"error-message",children:A})]})}var L=n(47541),P=n(27950),F=n(60255),B=(0,F.eI)({url:"https://api.studio.thegraph.com/query/36227/nft-marketplace-ethereum-goerl/v0.0.1",requestPolicy:"network-only"}),O=(0,F.eI)({url:"https://api.thegraph.com/subgraphs/name/polar0/nft-marketplace-polygon-mumbai"}),D=(0,F.eI)({url:"https://api.thegraph.com/subgraphs/name/polar0/nft-marketplace-arbitrum-goerl"});function V(){var e=function(e){"maticmum"===e?F(O):"arbitrum-goerli"===e?F(D):F(B)},t=function(e){"all"===e.target.value?p(!1):p(!0)},n=(0,b.mA)(),i=n.isDisconnected,c=n.address,l=(0,b.yL)().network,u=(0,k.useState)(!1),d=u[0],p=u[1],m=(0,k.useState)(!1),y=m[0],h=m[1],x=(0,k.useState)(!1),v=x[0],g=x[1],N=(0,k.useState)(!1),j=N[0],w=N[1],I=(0,k.useState)(""),A=I[0],E=I[1],_=(0,k.useState)(B),M=_[0],F=_[1],V=(0,k.useState)(null),Y=V[0],J=V[1],U=(0,k.useState)(!0),R=U[0],q=U[1],G=l.chainId?l.chainId.toString():"31337";function H(){return(H=(0,a.Z)(function(){var e,t;return(0,s.__generator)(this,function(t){switch(t.label){case 0:return[4,M.query(L.Z).toPromise()];case 1:return[4,Promise.all((e=t.sent()).data.activeItems)];case 2:return t.sent(),console.log(e),J(e.data.activeItems),e.data&&(console.log("yes"),q(!1)),[2]}})})).apply(this,arguments)}return(0,k.useEffect)(function(){T[G]&&E(T[G].NftMarketplace[0]),"goerli"===l.name||"maticmum"===l.name||"arbitrum-goerli"===l.name?w(!1):w(!0),e(l.name)},[l.chainId]),(0,k.useEffect)(function(){(function(){H.apply(this,arguments)})(),setTimeout(function(){setInterval(function(){console.log(Y)},2e3)},3e3)},[]),(0,r.jsx)("main",{className:o().main,children:(0,r.jsx)("div",{className:"content",children:(0,r.jsxs)("div",{className:"home-container",children:[(0,r.jsx)(C,{isVisible:y,hideModal:function(){return h(!1)}}),(0,r.jsx)(Z,{isVisible:v,hideModal:g}),(0,r.jsxs)("div",{className:"home-actions",children:[i?(0,r.jsx)("div",{}):R?"":Y&&(null==Y?void 0:Y.length)===0?(0,r.jsx)("div",{}):(0,r.jsxs)("div",{className:"action-filters",children:[(0,r.jsxs)("div",{className:"title",children:[(0,r.jsx)("div",{children:"Filters"}),(0,r.jsx)("i",{className:"fa-solid fa-filter"})]}),(0,r.jsxs)(P.ZP.Group,{className:"filter-group",onChange:t,defaultValue:"all",buttonStyle:"solid",disabled:j,children:[(0,r.jsx)(P.ZP.Button,{className:"filter-btn",value:"all",children:"All"}),(0,r.jsx)(P.ZP.Button,{className:"filter-btn",value:"owned",children:"Your listings"})]})]}),(0,r.jsxs)("div",{className:"home-actions-btns",children:[(0,r.jsx)(f.Z,{type:"primary",className:"mint-btn action-withdraw",onClick:function(){return g(!0)},disabled:j,children:"Proceeds"}),(0,r.jsx)(f.Z,{type:"primary",className:"mint-btn action-sell",onClick:function(){return h(!0)},disabled:j,children:"Sell"})]})]}),i?(0,r.jsx)("div",{className:"box-container error",children:"You must connect your wallet to see recently listed NFTs."}):j?(0,r.jsx)("div",{className:"box-container error",children:"You are on an unsupported network. Please change to Goerli or Mumbai."}):R?(0,r.jsx)("div",{className:"loader"}):Y&&(null==Y?void 0:Y.length)===0?(0,r.jsx)("div",{className:"box-container error",children:"No NFT listed on the marketplace yet."}):(0,r.jsx)("div",{className:"home-nft",children:Y&&(null==Y?void 0:Y.filter(function(e){return!d||e.seller===c}).map(function(e){return(0,r.jsx)(S,{nftAttributes:e,marketplaceAddress:A},"".concat(e.nftAddress).concat(e.tokenId))}))})]})})})}},4774:function(e,t,n){"use strict";n.d(t,{N:function(){return o},p:function(){return i}});var a=n(41799),s=n(69396),r=n(67976);function i(e,t,n,a,s){var i=(0,r.do)({addressOrName:e,contractInterface:t,functionName:n,args:a,enabled:s}),o=i.data,c=i.isError;return(i.isLoading,c)?(console.log("Error reading from contract"),null):o}function o(e,t,n,i,o,c){var l,u=(0,r.PJ)({addressOrName:e,contractInterface:t,functionName:n,args:i,enabled:c}),d=u.config,p=(u.status,u.error,u.refetch),m=(0,r.GG)((0,s.Z)((0,a.Z)({},d),{onSuccess:o.onSuccess,onError:o.onError})),f=m.data,y=m.write,h=(0,r.BX)({hash:null==f?void 0:f.hash,confirmations:1});return{write:y,isLoading:h.isLoading,isSuccess:h.isSuccess,refetch:p}}},67225:function(e){"use strict";e.exports=JSON.parse('[{"type":"constructor","payable":false,"inputs":[]},{"type":"event","anonymous":false,"name":"Approval","inputs":[{"type":"address","name":"owner","indexed":true},{"type":"address","name":"approved","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}]},{"type":"event","anonymous":false,"name":"ApprovalForAll","inputs":[{"type":"address","name":"owner","indexed":true},{"type":"address","name":"operator","indexed":true},{"type":"bool","name":"approved","indexed":false}]},{"type":"event","anonymous":false,"name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}]},{"type":"function","name":"TOKEN_URI","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string"}]},{"type":"function","name":"approve","constant":false,"payable":false,"inputs":[{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"balanceOf","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"owner"}],"outputs":[{"type":"uint256"}]},{"type":"function","name":"getApproved","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"address"}]},{"type":"function","name":"getTokenCounter","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"uint256"}]},{"type":"function","name":"getTokenOwner","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"address"}]},{"type":"function","name":"isApprovedForAll","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"owner"},{"type":"address","name":"operator"}],"outputs":[{"type":"bool"}]},{"type":"function","name":"mintNft","constant":false,"payable":false,"inputs":[],"outputs":[{"type":"uint256"}]},{"type":"function","name":"name","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string"}]},{"type":"function","name":"ownerOf","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"address"}]},{"type":"function","name":"safeTransferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"safeTransferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"},{"type":"bytes","name":"data"}],"outputs":[]},{"type":"function","name":"setApprovalForAll","constant":false,"payable":false,"inputs":[{"type":"address","name":"operator"},{"type":"bool","name":"approved"}],"outputs":[]},{"type":"function","name":"supportsInterface","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"bytes4","name":"interfaceId"}],"outputs":[{"type":"bool"}]},{"type":"function","name":"symbol","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string"}]},{"type":"function","name":"tokenURI","constant":true,"stateMutability":"pure","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"string"}]},{"type":"function","name":"transferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]}]')},48036:function(e){"use strict";e.exports=JSON.parse('{"5":{"NftMarketplace":["0x246fe124957897A2eb2E3Edd4d5AB3b726c993C6"],"BasicNft":["0x2EfeEfde77CB1af6310A5137C32840b74873F0a2"]},"80001":{"NftMarketplace":["0xc9F76d13D9695B0956072F150D12d83935f72eB1"],"BasicNft":["0x6e082e54A362d931526DB09b37a38E1747BEfdf0"]},"421613":{"NftMarketplace":["0xc9F76d13D9695B0956072F150D12d83935f72eB1"],"BasicNft":["0x6e082e54A362d931526DB09b37a38E1747BEfdf0"]}}')}},function(e){e.O(0,[13,643,731,412,774,888,179],function(){return e(e.s=75557)}),_N_E=e.O()}]);