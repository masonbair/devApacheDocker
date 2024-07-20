# syntax=docker/dockerfile:1

FROM mambaorg/micromamba:bullseye-slim

WORKDIR /ray-docker

USER root
RUN apt-get update && apt-get --no-install-recommends -y install x11-apps wget

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    wget -O "/usr/share/keyrings/xpra.asc" https://xpra.org/xpra.asc 
RUN apt-get update && wget -O "/etc/apt/sources.list.d/xpra.sources" https://raw.githubusercontent.com/Xpra-org/xpra/master/packaging/repos/bullseye/xpra.sources && \
    apt-get update && \
    ## In the future try to implement xpra using --no-install-recommends: xpra takes up way to much space, so having a way to make it smaller would be nice
    apt-get install -y xpra && \
    apt-get remove -y --purge wget && \
    apt-get autoremove -y --purge && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
    apt-get install -y --no-install-recommends xpra-html5 python3-requests && \
    rm -rf /var/lib/apt/lists/*

##-----------CONDA ENVIRONMENT-----------------##

ENV BASH_ENV ~/.bashrc
SHELL ["/bin/bash", "-c"]
COPY ./environment.yml ./environment.yml
RUN micromamba create -y -f ./environment.yml
RUN echo "micromamba activate pyimagej" >> ~/.bashrc
ENV PATH /opt/conda/envs/pyimagej/bin:$PATH
RUN micromamba clean --all -y \
    && micromamba clean -afy \
    && find /opt/conda/ -follow -type f -name '*.a' -delete \
    && find /opt/conda/ -follow -type f -name '*.pyc' -delete \
    && find /opt/conda/ -follow -type f -name '*.js.map' -delete

ENV CONDA_DEFAULT_ENV $(head -1 environment.yml | cut -d' ' -f2)

##---------------------------------------------##
COPY ./macros/ .
# copy xpra config file
COPY ./xpra.conf /etc/xpra/xpra.conf

# set default password
ENV XPRA_PASSWORD xpraPyimagej

# create run directory for xpra socket and set correct permissions for xpra user
# RUN mkdir -p /run/user/1000/xpra

# use docker-entrypoint.sh to allow passing options to xpra and start xpra from bash
COPY xpra.txt /xpra.txt
COPY ./start_ray.sh ./start_ray.sh

RUN touch /tmp/.X80-lock 

EXPOSE 8265
EXPOSE 10000
# Start Ray using the script
CMD ["./start_ray.sh"]
