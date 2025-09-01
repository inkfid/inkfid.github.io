{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "Container",
      "style": "default",
      "items": [
        {
          "type": "TextBlock",
          "text": "\ud83d\udce2 Visitor Arrival Notification",
          "weight": "Bolder",
          "size": "Large",
          "color": "Accent"
        },
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "Image",
                  "url": "$photoUrl",
                  "size": "Medium",
                  "style": "Person"
                }
              ]
            },
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "FactSet",
                  "facts": [
                    {
                      "title": "Visitor:",
                      "value": "$name"
                    },
                    {
                      "title": "Host:",
                      "value": "$hostFirstName"
                    },
                    {
                      "title": "Time:",
                      "value": "$time"
                    },
                    {
                      "title": "WIFI:",
                      "value": "TPGUEST"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "TextBlock",
          "text": "Please come and greet your guest when ready.",
          "wrap": true
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "Create WIFI Login",
      "url": "https://sponsor.travelport.com/"
    }
  ]
}
