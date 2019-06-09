<template>
    <div id="app">
        <div class="container">
            <div class="header">
                <div class="form-group row">
                    <div class="col-sm-7">
                        <img src="./assets/logo.png">
                    </div>
                    <label class="col-sm-2 col-form-label">Episode</label>
                    <div class="col-sm-3">
                        <select class="form-control" @change="getData()" v-model="selected">
                            <option v-for="item in episodes" :key="item._id" :value="item.episode" :selected="item.episode == selected">{{ item.episode }}</option>
                        </select>
                    </div>
                </div>
                <h1 v-if="title && release">{{ title }} ({{ release }})</h1>
            </div>
            <ul class="timeline">
                <li v-for="item in stamps" :key="item._id" class="timeline-item">
                    <div class="timeline-badge">{{ item.time }}</div>
                    <div class="timeline-panel">
                        <div class="timeline-heading">
                            <h4 class="timeline-title">{{ item.song.titles.en || 'Unknown' }}</h4>
                            <div class="timeline-panel-controls">
                                <div class="controls">
                                </div>
                                <div class="timestamp" v-if="item.song.id">
                                    <a href="javascript:;" class="text-muted" @click="play(item.song.id)">Play</a>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-body">Album: {{ item.album.titles.en || 'Unknown' }}</div>
                    </div>
                </li>
            </ul>
        </div>
        <audio ref="audio"></audio>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data: () => ({
        stamps: [],
        episodes: [],
        title: '',
        release: '',
        selected: null,
        src: '',
    }),
    created() {
        axios({
            url: `/list`
        }).then(res => {
            this.episodes = res.data;
            this.selected = res.data[0].episode;
            this.getData();
        }).catch(err => {
            console.error(err);
        });
    },
    methods: {
        getData() {
            axios({
                url: `/ep/` + this.selected
            }).then(res => {
                this.stamps = res.data.stamps;
                this.title = res.data.titles.en;
                this.release = res.data.release;
                document.title = `Episode ${this.selected}: ${this.title}`;
            }).catch(err => {
                console.error(err);
            });
        },
        play(id) {
            this.$refs['audio'].src = `${process.env.VUE_APP_AUDIO_SRC}/${id}.mp3`;
            this.$refs['audio'].play();
        },
    }
}
</script>
<style lang="scss">
@import 'https://fonts.googleapis.com/css?family=Libre+Franklin';

body {
    font-family: 'Libre Franklin', sans-serif;

    .header {
        margin: 10px 0;

        label {
            text-align: right;
        }
    }

    .timeline {
        list-style: none;
        padding: 20px 0 20px;
        position: relative;

        &:before {
            background-color: #eee;
            bottom: 0;
            content: " ";
            left: 50px;
            margin-left: -1.5px;
            position: absolute;
            top: 0;
            width: 3px;
        }

        >li {
            margin-bottom: 20px;
            position: relative;

            &:before,
            &:after {
                content: " ";
                display: table;
            }

            &:after {
                clear: both;
            }

            >.timeline-panel {
                border-radius: 2px;
                border: 1px solid #d4d4d4;
                box-shadow: 0 1px 2px rgba(100, 100, 100, 0.2);
                margin-left: 100px;
                padding: 20px;
                position: relative;

                .timeline-heading {
                    .timeline-panel-controls {
                        position: absolute;
                        right: 8px;
                        top: 5px;

                        .timestamp {
                            display: inline-block;
                        }

                        .controls {
                            display: inline-block;
                            padding-right: 5px;
                            border-right: 1px solid #aaa;

                            a {
                                color: #999;
                                font-size: 11px;
                                padding: 0 5px;

                                &:hover {
                                    color: #333;
                                    text-decoration: none;
                                    cursor: pointer;
                                }
                            }
                        }

                        .controls+.timestamp {
                            padding-left: 5px;
                        }
                    }
                }
            }

            .timeline-badge {
                background-color: #999;
                border-radius: 50%;
                color: #fff;
                font-size: 1em;
                height: 50px;
                left: 50px;
                line-height: 52px;
                margin-left: -25px;
                position: absolute;
                text-align: center;
                top: 16px;
                width: 50px;
                z-index: 100;
            }

            .timeline-badge+.timeline-panel {
                &:before {
                    border-bottom: 15px solid transparent;
                    border-left: 0 solid #ccc;
                    border-right: 15px solid #ccc;
                    border-top: 15px solid transparent;
                    content: " ";
                    display: inline-block;
                    position: absolute;
                    left: -15px;
                    right: auto;
                    top: 26px;
                }

                &:after {
                    border-bottom: 14px solid transparent;
                    border-left: 0 solid #fff;
                    border-right: 14px solid #fff;
                    border-top: 14px solid transparent;
                    content: " ";
                    display: inline-block;
                    position: absolute;
                    left: -14px;
                    right: auto;
                    top: 27px;
                }
            }
        }

        .timeline-title {
            margin-top: 0;
            color: inherit;
        }

        .timeline-body {

            >p,
            >ul {
                margin-bottom: 0;
            }

            >p+p {
                margin-top: 5px;
            }
        }
    }

}
</style>