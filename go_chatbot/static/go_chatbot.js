ChatbotLayout.loadSamples = function () {
    var self = this;
    self.showSampleLoader();
    $.getJSON(this.sampleLink, function (json) {

        self.moviename = json.moviename;
        self.nbrPeople = json.nbrPeople;
        self.date = json.date;
        self.time = json.time;
        self.city = json.city;
        self.theatre = json.theatre;
        self.getRandomSamples();
        self.pushMessage('<p>' + self.textStartingConversation + '</p>', 'bot');
        self.hideSampleLoader();
        $('#btn-refresh').removeClass('aix-invisible').on('click', function () {
            var samplesDisplay = [];
            self.getRandomSamples();
        });
    });
}

ChatbotLayout.getRandomSamples = function () {
    var samplesDisplay = [];
    var randomNumber = Math.ceil(Math.random() * (this.numberOfSamples));
    this.samplesDisplay.push(this.moviename[randomNumber]);
    this.samplesDisplay.push(this.nbrPeople[randomNumber]);
    this.samplesDisplay.push(this.date[randomNumber]);
    this.samplesDisplay.push(this.time[randomNumber]);
    this.samplesDisplay.push(this.city[randomNumber]);
    this.samplesDisplay.push(this.theatre[randomNumber]);
    console.log(this.samplesDisplay)
    this.showSamples();
}

 ChatbotLayout.showSamples = function () {
    $('#sample-data').empty();
    var samplesData = '';
    for(i = 0; i < this.samplesDisplay.length; i++){
        sampleText = '<div>' + this.samplesDisplay[i] + '</div>';
        console.log(sampleText)
    }
    //$('#sample-data').append(sampleText);

}

function submit(input) {
    var data = {"input": removePunctuation(input).toLowerCase()};
    var url = "/go_chatbot";
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        success: function (data) {
            var system_action_nl = data["system_action_nl"]
            var chat_ended = data["chat_ended"];

            if(chat_ended == true){
                endChat(1200);
            }

            ChatbotLayout.pushMessage('<span class="speech-buble-text">' + system_action_nl + '</span><br><a href="#">This is what I understood</a>', 'bot');
        }
    });
}

ChatbotLayout.config(
    {
        sampleLink: "go_chatbot/static/samples-info.json",
        textStartingConversation: 'Hello, how can I help you to book a movie ticket?',
        submitFunction: submit,
        config: function (options) {
            if (options.submitFunction) {
                this.submitFunction = options.submitFunction;
            } else {
                throw "SubmitFunction is not defined in config method.";
            }
            this.initializeUiEventHandler();
            if (options.sampleLink) {
                $('.sample-container').removeClass('aix-invisible');
                this.sampleLink = options.sampleLink;
                this.loadSamples();
            }
            if (options.textStartingConversation) {
                this.textStartingConversation = options.textStartingConversation;
            }
        }
    }
);

function removePunctuation(input) {
    return input.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '');
}

function endChat(time){
    setTimeout(
        function(){
            if(confirm('The dialogue finished')){
                window.location.reload();
            }
        }, time);
}

function refreshSampleData (){
    getRandomSamples();
}

$('.sample-container__header h4').text("Needed Information");
$('.btn-sample-refresh').removeClass("aix-invisible");
