export function ApolloScript() {
  const apolloScript = `
    function initApollo(){
      var n=Math.random().toString(36).substring(7),
      o=document.createElement("script");
      o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,
      o.async=!0,
      o.defer=!0,
      o.onload=function(){
        window.trackingFunctions.onLoad({
          appId:"${process.env.NEXT_PUBLIC_APOLLO_APP_ID || '68faee78c5da6c000d9ae0de'}"
        })
      },
      document.head.appendChild(o)
    }
    initApollo();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: apolloScript }}
    />
  );
}
